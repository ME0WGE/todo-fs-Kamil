import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Home({ tasks }) {
    // Task states
    // =======================================================
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskCompleted, setNewTaskCompleted] = useState(false);

    // UseForm
    // =======================================================
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        title: '',
        is_completed: false,
    });

    // Task functions
    // =======================================================
    function handleSubmit(e) {
        e.preventDefault();
        setData('title', newTaskTitle);
        setData('is_completed', newTaskCompleted);
        post('/tasks', {
            onSuccess: () => {
                setNewTaskTitle('');
                setNewTaskCompleted(false);
            },
        });
    }

    function handleCheck(e, task) {
        e.preventDefault();

        router.put(
            `/tasks/${task.id}`,
            {
                title: task.title,
                is_completed: e.target.checked ? 1 : 0,
            },
            { preserveState: true }
        );
    }

    function handleDelete(id) {
        destroy(`/tasks/${id}`);
    }

    function handleEditStart(task) {
        setEditingTaskId(task.id);
        setEditTitle(task.title);
    }

    function handleEditCancel() {
        setEditingTaskId(null);
        setEditTitle('');
    }

    function handleEditSave(taskId) {
        if (editTitle.trim()) {
            put(`/tasks/${taskId}`, {
                data: {
                    title: editTitle.trim(),
                    is_completed: tasks.find(t => t.id === taskId)?.is_completed || false,
                },
            });
            setEditingTaskId(null);
            setEditTitle('');
        }
    }

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        if (filter === 'active') return !task.is_completed;
        if (filter === 'completed') return task.is_completed;
        return true; // 'all'
    });

    // Active tasks
    const activeTasksCount = tasks.filter(task => !task.is_completed).length;
    // =======================================================

    return (
        <>
            <div className="w-full">
                <div className="w-full max-w-2xl mx-auto px-4 py-12">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-5xl md:text-6xl font-light tracking-wide text-rose-800 dark:text-rose-200">
                            Full-Stack Todo List
                        </h1>
                        <span className="text-xl md:text-xl font-light tracking-wide text-rose-700 dark:text-white">
                            Yeah, it works.
                        </span>
                    </div>

                    {/* Add task */}
                    <form onSubmit={handleSubmit} className="mb-6">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Add a task..."
                                name="title"
                                value={newTaskTitle}
                                onChange={e => {
                                    setData('title', e.target.value);
                                    setNewTaskTitle(e.target.value);
                                }}
                                className="flex-1 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white border border-gray-500 text-gray-900 placeholder-gray-700 dark:bg-black/40 dark:border-white/20 dark:text-white dark:placeholder-gray-300"
                            />
                            <button
                                type="submit"
                                className="px-6 py-4 bg-rose-300 hover:bg-rose-400 text-gray-900 rounded-2xl transition-colors cursor-pointer"
                            >
                                Add task
                            </button>
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-3 text-sm text-gray-800 dark:text-gray-300">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newTaskCompleted}
                                    onChange={e => {
                                        setData('is_completed', e.target.checked);
                                        setNewTaskCompleted(e.target.checked);
                                    }}
                                    className="w-4 h-4 rounded-full accent-rose-400 bg-white border-gray-300 dark:bg-black/40 dark:border-white/20"
                                />
                                <span>Mark as completed</span>
                            </label>
                        </div>
                    </form>

                    {/* Filters */}
                    <div className="mb-6 flex items-center justify-center gap-2 text-sm">
                        <button
                            className={`px-3 py-1.5 rounded-full cursor-pointer ${
                                filter === 'all'
                                    ? 'bg-gray-800 text-white dark:bg-white/20 dark:text-white'
                                    : 'text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                            }`}
                            onClick={() => setFilter('all')}
                        >
                            <i className="fas fa-list-ul mr-2"></i>All
                        </button>
                        <button
                            className={`px-3 py-1.5 rounded-full cursor-pointer ${
                                filter === 'active'
                                    ? 'bg-gray-800 text-white dark:bg-white/20 dark:text-white'
                                    : 'text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                            }`}
                            onClick={() => setFilter('active')}
                        >
                            <i className="fas fa-circle-notch mr-2"></i>Active
                        </button>
                        <button
                            className={`px-3 py-1.5 rounded-full cursor-pointer ${
                                filter === 'completed'
                                    ? 'bg-gray-800 text-white dark:bg-white/20 dark:text-white'
                                    : 'text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                            }`}
                            onClick={() => setFilter('completed')}
                        >
                            <i className="fas fa-check-circle mr-2"></i>Completed
                        </button>
                        {tasks.length - activeTasksCount > 0 && (
                            <button
                                className="px-3 py-1.5 rounded-full text-gray-800 hover:text-gray-900 cursor-pointer dark:text-gray-300 dark:hover:text-white"
                                onClick={() => destroy('/tasks/all')}
                            >
                                <i className="fas fa-trash mr-2 "></i>Clear completed
                            </button>
                        )}
                    </div>

                    {/* Tasks */}
                    <div className="space-y-3">
                        {filteredTasks.length === 0 ? (
                            <div className="text-center text-gray-800 dark:text-gray-300 py-12">No tasks yet.</div>
                        ) : (
                            filteredTasks.map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-start justify-between bg-white border border-gray-400 rounded-2xl px-4 py-3 dark:bg-white/10 dark:border-white/20"
                                >
                                    {/* check + title - edit input */}
                                    <div className="flex-1">
                                        {editingTaskId === task.id ? (
                                            <form
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    handleEditSave(task.id);
                                                }}
                                                className="flex items-center gap-3 w-full"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Edit task..."
                                                    value={editTitle}
                                                    onChange={e => {
                                                        setData('title', e.target.value);
                                                        setEditTitle(e.target.value);
                                                    }}
                                                    onKeyDown={e => e.key === 'Enter' && handleEditSave(task.id)}
                                                    autoFocus
                                                    className="flex-1 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white border border-gray-500 text-gray-900 placeholder-gray-700 dark:bg-black/30 dark:border-white/20 dark:text-white dark:placeholder-gray-300"
                                                />
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                                                    onClick={() => handleEditSave(task.id)}
                                                >
                                                    <i className="fas fa-check text-xs cursor-pointer"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center"
                                                    onClick={handleEditCancel}
                                                >
                                                    <i className="fas fa-times text-xs cursor-pointer"></i>
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="flex gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={task.is_completed}
                                                    onChange={e => handleCheck(e, task)}
                                                    className="w-6 h-6 rounded-full accent-rose-400 bg-white border-gray-500 dark:bg-black/40 dark:border-white/30 mt-1 flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={`task-title text-gray-900 dark:text-white ${
                                                            task.is_completed
                                                                ? 'line-through text-gray-700 dark:text-gray-400'
                                                                : ''
                                                        }`}
                                                    >
                                                        {task.title}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* edit - delete */}
                                    {editingTaskId !== task.id && (
                                        <div className="flex items-start gap-2 pt-1">
                                            <button
                                                aria-label="edit"
                                                className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center"
                                                onClick={() => handleEditStart(task)}
                                            >
                                                <i className="fas fa-pen cursor-pointer"></i>
                                            </button>
                                            <button
                                                aria-label="delete"
                                                className="w-8 h-8 rounded-full bg-gray-600 hover:bg-red-500 text-white flex items-center justify-center"
                                                onClick={() => handleDelete(task.id)}
                                            >
                                                <i className="fas fa-trash cursor-pointer"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
