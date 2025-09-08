export default function Home({ tasks }) {
    return (
        <>
            <h1>TodoLiiiiist</h1>
            <h2>Tasks</h2>
            {tasks.map((t) => (
                <ul key={t.id}>
                    <li>Task Name: {t.title}</li>
                    {t.description.length > 0 && <li>Task Description: {t.description}</li>}
                </ul>
            ))}
        </>
    );
}
