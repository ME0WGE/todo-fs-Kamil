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
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Add task form */}
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="space-y-4">
                    <label className="block text-sm font-medium">Nouvelle tâche</label>
                    <input
                        type="text"
                        placeholder="Titre de la tâche..."
                        name="title"
                        value={newTaskTitle}
                        onChange={e => {
                            setData('title', e.target.value);
                            setNewTaskTitle(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={newTaskCompleted}
                            onChange={e => {
                                setData('is_completed', e.target.checked);
                                setNewTaskCompleted(e.target.checked);
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-sm">Tâche terminée</span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                    Ajouter la tâche
                </button>
            </form>

            {/* Filter tasks */}
            <div className="mb-6">
                <div className="flex gap-2 mb-4">
                    <button
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                            filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setFilter('all')}
                    >
                        Toutes ({tasks.length})
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                            filter === 'active'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setFilter('active')}
                    >
                        Actives ({activeTasksCount})
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                            filter === 'completed'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setFilter('completed')}
                    >
                        Terminées ({tasks.length - activeTasksCount})
                    </button>
                </div>

                {tasks.length - activeTasksCount > 0 && (
                    <button
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                        onClick={() => {
                            const completedTasks = tasks.filter(task => task.is_completed);
                            completedTasks.forEach(task => {
                                destroy(`/tasks/${task.id}`);
                            });
                        }}
                    >
                        Effacer les terminées
                    </button>
                )}
            </div>

            {/* List tasks */}
            <div>
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p className="text-lg">
                            {filter === 'all'
                                ? 'Aucune tâche'
                                : filter === 'active'
                                ? 'Aucune tâche active'
                                : 'Aucune tâche terminée'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredTasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-4 p-4">
                                    {/* Checkbox - !editMode */}
                                    {editingTaskId !== task.id && (
                                        <input
                                            type="checkbox"
                                            checked={task.is_completed}
                                            onChange={e => handleCheck(e, task)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    )}

                                    {/* Task content - Edit task */}
                                    <div className="flex-1">
                                        {editingTaskId === task.id ? (
                                            <form
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    put('tasks.update', task.id);
                                                }}
                                                className="flex gap-3"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Editer la tâche..."
                                                    value={editTitle}
                                                    onChange={e => {
                                                        setData('title', e.target.value);
                                                        setEditTitle(e.target.value);
                                                    }}
                                                    onKeyDown={e => e.key === 'Enter' && handleEditSave(task.id)}
                                                    autoFocus
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                                                    onClick={() => handleEditSave(task.id)}
                                                >
                                                    <i className="fas fa-check"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                                                    onClick={handleEditCancel}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </form>
                                        ) : (
                                            <h3
                                                className={`text-lg ${
                                                    task.is_completed
                                                        ? 'line-through text-gray-500 dark:text-gray-400'
                                                        : 'text-gray-900 dark:text-white'
                                                }`}
                                            >
                                                {task.title}
                                            </h3>
                                        )}
                                    </div>

                                    {/* Edit / Delete */}
                                    {editingTaskId !== task.id && (
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                                                onClick={() => handleEditStart(task)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>

                                            <button
                                                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                                                onClick={() => handleDelete(task.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
