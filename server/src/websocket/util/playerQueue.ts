export interface QueueEntry {
  userId: string;
  elo: number;
}

export class MatchmakingQueue {
  private nodes: QueueEntry[] = [];
  private indexMap: Map<string, number> = new Map(); // userId -> heap index

  get size(): number {
    return this.nodes.length;
  }

  isEmpty(): boolean {
    return this.nodes.length === 0;
  }

  has(userId: string): boolean {
    return this.indexMap.has(userId);
  }

  insert(entry: QueueEntry): void {
    this.nodes.push(entry);
    const index = this.nodes.length - 1;
    this.indexMap.set(entry.userId, index);
    this.bubbleUp(index);
  }

  pop(): QueueEntry | null {
    if (this.isEmpty()) return null;
    const root = this.nodes[0];
    this.swap(0, this.nodes.length - 1);
    this.nodes.pop();
    this.indexMap.delete(root.userId);
    if (!this.isEmpty()) this.bubbleDown(0);
    return root;
  }

  peek(): QueueEntry | null {
    return this.nodes[0] ?? null;
  }

  peekIndex(index: number): QueueEntry | null {
    return this.nodes[index] ?? null;
  }

  remove(userId: string): boolean {
    const index = this.indexMap.get(userId);
    if (index === undefined) return false;

    const lastIndex = this.nodes.length - 1;

    if (index === lastIndex) {
      this.nodes.pop();
      this.indexMap.delete(userId);
      return true;
    }

    this.swap(index, lastIndex);
    this.nodes.pop();
    this.indexMap.delete(userId);

    this.bubbleUp(index);
    this.bubbleDown(index);

    return true;
  }

  clear(): void {
    this.nodes = [];
    this.indexMap.clear();
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.nodes[parentIndex].elo <= this.nodes[index].elo) break;
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.nodes.length;
    while (true) {
      let smallest = index;
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      if (left < length && this.nodes[left].elo < this.nodes[smallest].elo) {
        smallest = left;
      }
      if (right < length && this.nodes[right].elo < this.nodes[smallest].elo) {
        smallest = right;
      }
      if (smallest === index) break;

      this.swap(index, smallest);
      index = smallest;
    }
  }

  private swap(i: number, j: number): void {
    this.indexMap.set(this.nodes[i].userId, j);
    this.indexMap.set(this.nodes[j].userId, i);
    [this.nodes[i], this.nodes[j]] = [this.nodes[j], this.nodes[i]];
  }
}
