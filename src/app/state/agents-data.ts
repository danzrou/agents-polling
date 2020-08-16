import { Agent } from './agent.model';

let uniqueId = 0;

export function generateAgents(count: number = 2): Agent[] {
  const res = [];
  for (let i = 0; i < count; i++) {
    const id = uniqueId++;
    res.push({ id, name: `Agent ${id}`, status: id % 2 === 0 ? 'disabled' : 'enabled' });
  }
  return res;
}
