import { Component } from "@angular/core";
import { Todo } from "../todo";
import { TodoService } from "../todo.service";

@Component({
  selector: "app-todo-input",
  templateUrl: "./todo-input.component.html",
  styleUrls: ["./todo-input.component.scss"],
})
export class TodoInputComponent {
  constructor(private todoService: TodoService) {}

  add(text: string): void {
    text = text.trim();
    if (!text) {
      return;
    }
    this.todoService.addTodo({ text } as Todo).subscribe();
  }
}
