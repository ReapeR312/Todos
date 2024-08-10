import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TodosComponent } from "./todos/todos.component";

const routes: Routes = [
  { path: "todos", component: TodosComponent },
  { path: "active", component: TodosComponent, data: { filter: "active" } },
  {
    path: "completed",
    component: TodosComponent,
    data: { filter: "completed" },
  },
  { path: "**", redirectTo: "/todos", pathMatch: "full" },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
