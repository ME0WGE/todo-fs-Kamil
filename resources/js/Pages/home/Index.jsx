import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Home({ tasks }) {
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskCompleted, setNewTaskCompleted] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState({});

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

    return (
        <>
            <div>
                {/* Add task form */}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nouvelle tâche</label>
                        <input
                            type="text"
                            placeholder="Titre de la tâche..."
                            name="title"
                            value={newTaskTitle}
                            onChange={e => {
                                setData('title', e.target.value);
                                setNewTaskTitle(e.target.value);
                            }}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={newTaskCompleted}
                                onChange={e => {
                                    setData('is_completed', e.target.checked);
                                    setNewTaskCompleted(e.target.checked);
                                }}
                            />
                            Tâche terminée
                        </label>
                    </div>
                    <button>Ajouter la tâche</button>
                </form>

                {/* Filter tasks */}
                <div>
                    <div className="flex gap-5">
                        <button className="cursor-pointer border-1 rounded" onClick={() => setFilter('all')}>
                            Toutes ({tasks.length})
                        </button>
                        <button className="cursor-pointer border-1 rounded" onClick={() => setFilter('active')}>
                            Actives ({activeTasksCount})
                        </button>
                        <button className="cursor-pointer border-1 rounded" onClick={() => setFilter('completed')}>
                            Terminées ({tasks.length - activeTasksCount})
                        </button>
                    </div>

                    {tasks.length - activeTasksCount > 0 && <button>Effacer les terminées</button>}
                </div>

                {/* List tasks */}
                <div>
                    {filteredTasks.length === 0 ? (
                        <div>
                            <p>
                                {filter === 'all'
                                    ? 'Aucune tâche'
                                    : filter === 'active'
                                    ? 'Aucune tâche active'
                                    : 'Aucune tâche terminée'}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredTasks.map(task => (
                                <div key={task.id}>
                                    <div className="flex gap-5 mb-5">
                                        {/* Checkbox - seulement si pas en mode édition */}
                                        {editingTaskId !== task.id && (
                                            <input
                                                type="checkbox"
                                                checked={
                                                    checkboxStates[task.id] !== undefined
                                                        ? checkboxStates[task.id]
                                                        : task.is_completed
                                                }
                                                onChange={e => handleCheck(e, task)}
                                            />
                                        )}

                                        {/* Task content - Modify task */}
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
                                                    />
                                                    <button
                                                        className="cursor-pointer border-1 border-green-400 rounded px-2"
                                                        onClick={() => handleEditSave(task.id)}
                                                    >
                                                        ✅
                                                    </button>
                                                    <button
                                                        className="cursor-pointer border-1 border-gray-400 rounded px-2"
                                                        onClick={handleEditCancel}
                                                    >
                                                        ❌
                                                    </button>
                                                </form>
                                            ) : (
                                                <h3
                                                    style={{
                                                        textDecoration: task.is_completed ? 'line-through' : 'none',
                                                    }}
                                                >
                                                    {task.title}
                                                </h3>
                                            )}
                                        </div>

                                        {/* Modify / Delete */}
                                        {editingTaskId !== task.id && (
                                            <div className="flex gap-3">
                                                <button
                                                    className="cursor-pointer border-1 border-orange-400 rounded px-2"
                                                    onClick={() => handleEditStart(task)}
                                                >
                                                    ✏️
                                                </button>

                                                <button
                                                    className="cursor-pointer border-1 border-red-400 rounded px-2"
                                                    onClick={() => handleDelete(task.id)}
                                                >
                                                    🗑️
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
        </>
    );
}
