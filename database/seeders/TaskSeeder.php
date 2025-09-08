<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Task::insert([
            [
                'title' => 'task1',
                'is_completed' => false,
            ],
            [
                'title' => 'task2',
                'is_completed' => false,
            ],
            [
                'title' => 'task3',
                'is_completed' => false,
            ],
        ]);
    }
}
