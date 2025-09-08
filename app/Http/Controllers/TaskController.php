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
            'is_completed' => "required|boolean",
        ]);

        $task = new Task();
        $task->title = $request->title;
        $task->is_completed = $request->is_completed;
        $task->save();

        return Inertia::location(route('home'));
    }
    public function show() {}
    public function edit() {}
    public function update() {}
    public function destroy($id) {
        $task = Task::findOrFail($id);
        $task->delete();
        return;
    }
}
