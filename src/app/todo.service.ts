import { Injectable } from "@angular/core";
import {
  Observable,
  BehaviorSubject,
  tap,
  forkJoin,
  switchMap,
  take,
} from "rxjs";
import { Todo } from "./todo";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  private todoUrl = "api/todos";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) {
    this.getTodos().subscribe((todos) => this.todosSubject.next(todos));
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todoUrl);
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.todoUrl, todo, this.httpOptions).pipe(
      tap(() => {
        this.getTodos().subscribe((todos) => this.todosSubject.next(todos));
      })
    );
  }

  deleteTodo(id: number): Observable<void> {
    const url = `${this.todoUrl}/${id}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(() => {
        this.getTodos().subscribe((todos) => this.todosSubject.next(todos));
      })
    );
  }

  updateTodoCompletion(todo: Todo): Observable<Todo> {
    const url = `${this.todoUrl}/${todo.id}`;
    return this.http.put<Todo>(url, todo, this.httpOptions);
  }

  deleteCompletedTodos(): Observable<void> {
    return this.todos$.pipe(
      take(1),
      switchMap((todos) => {
        const completedTodos = todos.filter((todo) => todo.completed);
        const deleteRequests = completedTodos.map((todo) =>
          this.deleteTodo(todo.id)
        );
        return forkJoin(deleteRequests).pipe(
          tap(() => {
            this.getTodos().subscribe((todos) => this.todosSubject.next(todos));
          }),
          switchMap(
            () => new Observable<void>((observer) => observer.complete())
          )
        );
      })
    );
  }

  completedTodosAll(event: boolean): Observable<void> {
    return this.todos$.pipe(
      take(1),
      switchMap((todos) => {
        const completedTodos = todos.filter((todo) => {
          return event ? todo.completed : !todo.completed;
        });
        const changeRequests = completedTodos.map((todo) =>
          this.updateTodoCompletion({ ...todo, completed: event })
        );
        return forkJoin(changeRequests).pipe(
          switchMap(
            () => new Observable<void>((observer) => observer.complete())
          )
        );
      })
    );
  }
}
