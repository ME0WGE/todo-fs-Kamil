import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Home({ tasks }) {
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        is_completed: false,
    });

    function handleSubmit (e) {
        e.preventDefault();
        post('/tasks');
    };

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
                <div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Nouvelle tâche</label>
                            <input
                                type="text"
                                placeholder="Titre de la tâche..."
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                            />
                        </div>
                        <button>Ajouter la tâche</button>
                    </form>
                </div>

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
                            <p>
                                {filter === 'all'
                                    ? 'Commencez par ajouter votre première tâche !'
                                    : filter === 'active'
                                    ? 'Toutes vos tâches sont terminées !'
                                    : "Aucune tâche n'a été terminée pour le moment."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredTasks.map(task => (
                                <div key={task.id}>
                                    <div className="flex gap-5 mb-5">
                                        {/* Checkbox */}
                                        <button>
                                            <input type="checkbox" checked={task.is_completed} readOnly />
                                        </button>

                                        {/* Task content */}
                                        <div>
                                            <h3 style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>
                                                {task.title}
                                            </h3>
                                        </div>

                                        {/* Modify / Delete */}
                                        <div className="flex gap-3">
                                            <button className="cursor-pointer border-1 border-orange-400 rounded">
                                                ✏️
                                            </button>
                                            <button className="cursor-pointer border-1 border-red-400 rounded">
                                                🗑️
                                            </button>
                                        </div>
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
