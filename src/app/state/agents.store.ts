import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Agent } from './agent.model';

export interface Log {
  id: number;
  pollTime: Date;
}

export interface AgentsState extends EntityState<Agent> {
  logs: Log[];
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'agents' })
export class AgentsStore extends EntityStore<AgentsState> {
  constructor() {
    super({ logs: [] });
  }
}
