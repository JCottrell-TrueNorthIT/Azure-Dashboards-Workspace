export class Cache<T> {
    private cache: Map<string, [T, number]> = new Map<string, [T, number]>();

    public get(key: string): T | undefined {
        const [value, expiration] = this.cache.get(key) ?? [undefined, 0];

        if (expiration < Date.now()) {
            this.cache.delete(key);
            return undefined;
        }

        return value;
    }

    public set(key: string, value: T): void {
        this.cache.set(key, [value, Date.now() + 1000 * 60 * 5]);
    }

    public clear(): void {
        this.cache.clear();
    }
}