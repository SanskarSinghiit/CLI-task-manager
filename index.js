#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import fs from "fs";
import path from "path";

const taskFile = path.join(process.cwd(), 'task.json');

// Ensures task file exists
if (!fs.existsSync(taskFile)) {
    fs.writeFileSync(taskFile, JSON.stringify([])); // Create an empty task.json if it doesn't exist
}

// Load tasks
function loadTasks() {
    try {
        const taskData = fs.readFileSync(taskFile, 'utf8');
        return taskData ? JSON.parse(taskData) : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

// Save tasks to file
function saveTasks(tasks) {
    try {
        fs.writeFileSync(taskFile, JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

// Add task
function addTask(task) {
    const tasks = loadTasks();
    tasks.push({ id: Date.now(), title: task, completed: false });
    saveTasks(tasks);
    console.log(chalk.greenBright('Task added successfully!'));
}

// List all tasks
function listTasks() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log(chalk.yellow('No tasks found.'));
        return;
    }

    console.log(`
┌─────────────────────────────────────────────────────────────────────────────────
│     status    │          task id          │      task description      
├─────────────────────────────────────────────────────────────────────────────────
    `);

    tasks.forEach(element => {
        const status = element.completed ? chalk.green('✓') : chalk.red('✗');
        console.log(`│       ${status}       │       ${element.id}       │      ${element.title}      `);
    });

    console.log(`└─────────────────────────────────────────────────────────────────────────────────`);
}


// Mark task as complete
function completeTask(id) {
    let tasks = loadTasks();
    let task = tasks.find(t => t.id === parseInt(id));
    if (task) {
        task.completed = true;
        saveTasks(tasks);
        console.log(chalk.greenBright('Task marked as complete'));
    } else {
        console.log(chalk.red('Task not found'));
    }
}

// Mark the task as incomplete
function incompleteTask(id) {
    let tasks = loadTasks();
    let task = tasks.find(t => t.id === parseInt(id));
    if (task) {
        task.completed = false;
        saveTasks(tasks);
        console.log(chalk.greenBright('Task marked as incomplete'));
    } else {
        console.log(chalk.red('Task not found'));
    }
}

// Delete a task
function deleteTask(id) {
    let tasks = loadTasks();
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== parseInt(id));
    if (tasks.length < initialLength) {
        saveTasks(tasks);
        console.log(chalk.green('Task deleted successfully!'));
    } else {
        console.log(chalk.red('Task not found.'));
    }
}

// Delete all tasks
function deleteAllTasks() {
    saveTasks([]);
    console.log(chalk.greenBright('All tasks deleted'));
}

// Start function
function startTaskManager() {
    console.log('\n-------------------------------------------------------');
    console.log(chalk.greenBright('Welcome to the CLI Task Manager'));
    console.log(`\n${chalk.bgBlack(chalk.green(' Commands for Execution - '))}`);
    console.log(`
        ${chalk.greenBright('  list        : ')} ${chalk.white(' Displays the list of all tasks ')}
        ${chalk.greenBright('  add <task>  : ')} ${chalk.white(' Adds the task in the task list')}
        ${chalk.greenBright('  done <id>   : ')} ${chalk.white(' Marks the task as complete')}
        ${chalk.greenBright('  delete <id> : ')} ${chalk.white(' Deletes the task from the task list')}
        ${chalk.greenBright('  delete-all  : ')} ${chalk.white(' Deletes all tasks')}
    `);
    // console.log('-------------------------------------------------------');
}


program
    .action(startTaskManager);

program
    .command('add <task>')
    .description('Add a new task')
    .action(addTask);

program
    .command('list')
    .description('Shows all tasks')
    .action(listTasks);

program
    .command('delete <id>')
    .description('Deletes the task')
    .action(deleteTask);

program
    .command('done <id>')
    .description('Marks the task as completed')
    .action(completeTask);

program
    .command('undone <id>')
    .description('Marks the task as incomplete')
    .action(incompleteTask);

program
    .command('delete-all')
    .description('Deletes all tasks')
    .action(deleteAllTasks);

program.parse(process.argv);
