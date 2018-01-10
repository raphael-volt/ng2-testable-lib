import { Injectable } from '@angular/core';

@Injectable()
export class SampleService {

  constructor() { }

  get name(): string {
    return this.constructor.name
  }

}
