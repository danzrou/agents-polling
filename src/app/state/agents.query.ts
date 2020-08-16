import { Injectable } from '@angular/core';
import { EntityActions, QueryEntity } from '@datorama/akita';
import { debug } from '@siemplify/core/rxjs';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Agent } from './agent.model';
import { AgentsState, AgentsStore } from './agents.store';

@Injectable({ providedIn: 'root' })
export class AgentsQuery extends QueryEntity<AgentsState> {
  constructor(protected store: AgentsStore) {
    super(store);
  }

  selectPollable(): Observable<{ enabled: Agent[]; disabled: Agent[] }> {
    return this.selectEntityAction([EntityActions.Add, EntityActions.Update]).pipe(
      debug('Action'),
      switchMap((action) =>
        this.selectMany(action.ids).pipe(
          map((agents) => {
            const enabled = agents.filter((agent) => agent.status === 'enabled');
            const disabled = agents.filter((agent) => !enabled.includes(agent));

            return { enabled, disabled };
          })
        )
      ),
    );
  }

  selectAdded(): Observable<Agent[]> {
    return this.selectEntityAction(EntityActions.Add).pipe(
      debug('Updated / Added'),
      switchMap((ids) => this.selectMany(ids))
    );
  }

  selectedUpdated(): Observable<Agent[]> {
    return this.selectEntityAction(EntityActions.Update).pipe(
      switchMap((ids) => this.selectMany(ids))
    );
  }

  agentUpdated(id: number): Observable<any> {
    return this.selectEntityAction(EntityActions.Update).pipe(filter((ids) => ids.includes(id)), debug('Updated'));
  }
}
