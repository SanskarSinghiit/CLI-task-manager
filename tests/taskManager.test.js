const { addTask, loadTasks } = require('../index'); // Use require instead of import

describe('Task Manager', () => {
    beforeEach(() => {
        // Reset the tasks before each test (e.g., clear task.json)
        // Mock or clean up task.json to a blank state if needed
    });

    test('adds a task correctly', () => {
        const task = 'Test Task';
        addTask(task);

        const tasks = loadTasks();
        expect(tasks.length).toBe(1);
        expect(tasks[0].title).toBe('Test Task');
    });
});
