function maxFrequencyElements(nums: number[]): number {
    const cnt: number[] = Array(101).fill(0);
    for (const x of nums) {
        ++cnt[x];
    }
    let [ans, mx] = [0, -1];
    for (const x of cnt) {
        if (mx < x) {
            mx = x;
            ans = x;
        } else if (mx === x) {
            ans += x;
        }
    }
    return ans;
}
