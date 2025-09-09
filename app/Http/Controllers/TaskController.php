<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index() {}
    public function create() {
        $tasks = Task::all();
        return Inertia::render('tasks/Create', compact('tasks'));
    }
    public function store(Request $request) {
        $request->validate([
            'title' => "required|string",
            'is_completed' => "sometimes|boolean",
        ]);

        Task::create([
            'title' => $request->title,
            'is_completed' => false,
        ]);

        return;
    }
    public function show() {}
    public function edit($id) {
        $task = Task::findOrFail($id);
        return Inertia::render('tasks/Edit', compact('task'));
    }
    public function update(Request $request, $id) {
        $task = Task::findOrFail($id);

        $request->validate([
            'title' => "required|string",
            'is_completed' => "boolean",
        ]);

        $task->update([
            'title' => $request->title,
            'is_completed' => $request->is_completed,
        ]);

        return;
    }
    public function destroy($id) {
        $task = Task::findOrFail($id);
        $task->delete();
        return;
    }
}
