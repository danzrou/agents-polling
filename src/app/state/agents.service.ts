import { Injectable } from '@angular/core';
import { arrayAdd } from '@datorama/akita';
import { random } from '@siemplify/utils';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { generateAgents } from './agents-data';
import { AgentsQuery } from './agents.query';
import { AgentsStore, Log } from './agents.store';

@Injectable({ providedIn: 'root' })
export class AgentsService {
  constructor(private store: AgentsStore, private query: AgentsQuery) {}

  addAgent(): void {
    this.store.add(generateAgents(1));
  }

  updateRandomAgent(): void {
    const count = this.query.getCount();
    const selected = random(0, count);
    this.store.update(selected, (agent) => {
      const newStatus = agent.status === 'disabled' ? 'enabled' : 'disabled';
      alert(`Agent ${selected} is now ${newStatus}`);
      return {
        ...agent,
        status: newStatus
      };
    });
  }

  refresh(id: number): Observable<any> {
    return of(true).pipe(
      delay(500),
      tap(() => {
        console.log('Refreshing ', id);
        this.store.update((state) => {
          return {
            ...state,
            logs: arrayAdd<Log[]>(state.logs, { id, pollTime: new Date().toISOString() })
          };
        });
      })
    );
  }
}
