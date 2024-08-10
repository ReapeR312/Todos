import { Component, OnInit } from "@angular/core";
import { Todo } from "../todo";
import { TodoService } from "../todo.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/internal/operators/map";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  todos$!: Observable<Todo[]>;
  editingTodoId: number | null = null;
  newTodoText: string = "";
  allTodosCompleted: boolean = false;

  constructor(
    private todoService: TodoService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.todoService.todos$.subscribe((todos) => (this.todos = todos));

    this.route.data.subscribe((data) => {
      this.todos$ = this.todoService.todos$.pipe(
        map((todos) => this.filterTodos(todos, data["filter"]))
      );
    });
  }

  getTodos() {
    this.todoService.getTodos().subscribe((todos) => (this.todos = todos));
  }

  delete(todo: Todo): void {
    this.todoService.deleteTodo(todo.id).subscribe();
  }

  lengthTodo(): number {
    return this.todos.length;
  }

  todoLeft(): number {
    return this.todos.filter((todo) => !todo.completed).length;
  }

  filterTodos(todos: Todo[], filter: string): Todo[] {
    const active = document.getElementById("active");
    const all = document.getElementById("all");
    const completed = document.getElementById("completed");

    switch (filter) {
      case "active":
        return (
          (active!.style.color = "red"), todos.filter((todo) => !todo.completed)
        );
      case "completed":
        return (
          (completed!.style.color = "red"),
          todos.filter((todo) => todo.completed)
        );
      default:
        return (all!.style.color = "red"), todos;
    }
  }

  deleteCompleted() {
    this.todoService.deleteCompletedTodos().subscribe();
  }

  startEditing(todo: Todo) {
    this.editingTodoId = todo.id;
    this.newTodoText = todo.text;
  }

  stopEditing(todo: Todo) {
    if (this.newTodoText.trim() !== "") {
      todo.text = this.newTodoText;
      this.todoService.updateTodoCompletion(todo).subscribe(() => {
        this.editingTodoId = null;
      });
    } else {
      this.editingTodoId = null;
    }
  }

  onCheckboxChange(todo: Todo) {
    this.todoService.updateTodoCompletion(todo).subscribe(() => {
      if (!todo.completed) {
        this.allTodosCompleted = false;
      } else {
        this.allTodosCompleted = this.todos.every((t) => t.completed);
      }
    });
  }

  completedTodosAll(e: MatCheckboxChange) {
    this.todos.forEach((todo) => {
      todo.completed = e.checked;
    });

    this.todoService.completedTodosAll(e.checked).subscribe();
  }
}
