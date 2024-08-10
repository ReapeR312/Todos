import { Component } from '@angular/core';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ToDo';
  todos: Todo[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos() {
    this.todoService.getTodos().subscribe((todos) => (this.todos = todos));
  }

  addTodo(text: string): void {
    this.todoService.addTodo({ text } as Todo).subscribe((todo) => {
      this.todos.push(todo);
    });
  }

  deleteTodo(todo: Todo): void {
    this.todos = this.todos.filter((h) => h !== todo);
    this.todoService.deleteTodo(todo.id).subscribe();
  }
}
