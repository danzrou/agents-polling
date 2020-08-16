import { Component, OnInit } from '@angular/core';
import { debug, polling } from '@siemplify/core/rxjs';
import { merge } from 'rxjs';
import { mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { AgentsQuery } from './state/agents.query';
import { AgentsService } from './state/agents.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  agents$ = this.agentQuery.selectAll();
  logs$ = this.agentQuery.select('logs');

  constructor(private agentQuery: AgentsQuery, private agentService: AgentsService) {}

  ngOnInit(): void {
    this.agentQuery
      .selectPollable()
      .pipe(
        debug('Agents'),
        mergeMap(({ enabled, disabled }) => {
          const request = (agent) => this.agentService.refresh(agent.id);
          return merge(
            ...[
              ...enabled.map((agent) =>
                polling(request(agent), 5000).pipe(
                  takeUntil(this.agentQuery.agentUpdated(agent.id))
                )
              ),
              ...disabled.map((agent) =>
                polling(request(agent), 2000, 2000).pipe(
                  takeUntil(this.agentQuery.agentUpdated(agent.id))
                )
              )
            ]
          ).pipe(debug('Polling'));
        })
      )
      .subscribe();
  }

  addAgent(): void {
    this.agentService.addAgent();
  }

  updateAgent(): void {
    this.agentService.updateRandomAgent();
  }
}
