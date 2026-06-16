import { Resource } from "../src/index.js";

export interface ExampleUser {
  id: number;
  name: string;
}

export const exampleUser: ExampleUser = {
  id: 1,
  name: "John",
};

export class ExampleUserResource extends Resource<ExampleUser> {
  toArray() {
    return {
      id: this.resource.id,
      name: this.resource.name,
    };
  }
}
