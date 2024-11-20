---
comments: true
difficulty: 中等
edit_url: https://github.com/doocs/leetcode/edit/main/solution/3300-3399/3334.Find%20the%20Maximum%20Factor%20Score%20of%20Array/README.md
rating: 1518
source: 第 421 场周赛 Q1
tags:
    - 数组
    - 数学
    - 数论
---

<!-- problem:start -->

# [3334. 数组的最大因子得分](https://leetcode.cn/problems/find-the-maximum-factor-score-of-array)

[English Version](/solution/3300-3399/3334.Find%20the%20Maximum%20Factor%20Score%20of%20Array/README_EN.md)

## 题目描述

<!-- description:start -->

<p>给你一个整数数组 <code>nums</code>。</p>

<p><strong>因子得分 </strong>定义为数组所有元素的最小公倍数（LCM）与最大公约数（GCD）的<strong> 乘积</strong>。</p>

<p>在 <strong>最多</strong> 移除一个元素的情况下，返回 <code>nums</code> 的<strong> 最大因子得分</strong>。</p>

<p><strong>注意</strong>，单个数字的 <span data-keyword="lcm-function">LCM</span> 和 <span data-keyword="gcd-function">GCD</span> 都是其本身，而<strong> </strong><strong>空数组</strong> 的因子得分为 0。</p>

<p>&nbsp;</p>

<p><strong class="example">示例 1：</strong></p>

<div class="example-block">
<p><strong>输入：</strong> <span class="example-io">nums = [2,4,8,16]</span></p>

<p><strong>输出：</strong> <span class="example-io">64</span></p>

<p><strong>解释：</strong></p>

<p>移除数字 2 后，剩余元素的 GCD 为 4，LCM 为 16，因此最大因子得分为 <code>4 * 16 = 64</code>。</p>
</div>

<p><strong class="example">示例 2：</strong></p>

<div class="example-block">
<p><strong>输入：</strong> <span class="example-io">nums = [1,2,3,4,5]</span></p>

<p><strong>输出：</strong> <span class="example-io">60</span></p>

<p><strong>解释：</strong></p>

<p>无需移除任何元素即可获得最大因子得分 60。</p>
</div>

<p><strong class="example">示例 3：</strong></p>

<div class="example-block">
<p><strong>输入：</strong> <span class="example-io">nums = [3]</span></p>

<p><strong>输出：</strong> 9</p>
</div>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= nums.length &lt;= 100</code></li>
	<li><code>1 &lt;= nums[i] &lt;= 30</code></li>
</ul>

<!-- description:end -->

## 解法

<!-- solution:start -->

### 方法一

<!-- tabs:start -->

#### Python3

```python
class Solution:
    def maxScore(self, nums: List[int]) -> int:
        n = len(nums)
        suf_gcd = [0] * (n + 1)
        suf_lcm = [0] * n + [1]
        for i in range(n - 1, -1, -1):
            suf_gcd[i] = gcd(suf_gcd[i + 1], nums[i])
            suf_lcm[i] = lcm(suf_lcm[i + 1], nums[i])
        ans = suf_gcd[0] * suf_lcm[0]
        pre_gcd, pre_lcm = 0, 1
        for i, x in enumerate(nums):
            ans = max(ans, gcd(pre_gcd, suf_gcd[i + 1]) * lcm(pre_lcm, suf_lcm[i + 1]))
            pre_gcd = gcd(pre_gcd, x)
            pre_lcm = lcm(pre_lcm, x)
        return ans
```

#### Java

```java
class Solution {
    public long maxScore(int[] nums) {
        int n = nums.length;
        long[] sufGcd = new long[n + 1];
        long[] sufLcm = new long[n + 1];
        sufLcm[n] = 1;
        for (int i = n - 1; i >= 0; --i) {
            sufGcd[i] = gcd(sufGcd[i + 1], nums[i]);
            sufLcm[i] = lcm(sufLcm[i + 1], nums[i]);
        }
        long ans = sufGcd[0] * sufLcm[0];
        long preGcd = 0, preLcm = 1;
        for (int i = 0; i < n; ++i) {
            ans = Math.max(ans, gcd(preGcd, sufGcd[i + 1]) * lcm(preLcm, sufLcm[i + 1]));
            preGcd = gcd(preGcd, nums[i]);
            preLcm = lcm(preLcm, nums[i]);
        }
        return ans;
    }

    private long gcd(long a, long b) {
        return b == 0 ? a : gcd(b, a % b);
    }

    private long lcm(long a, long b) {
        return a / gcd(a, b) * b;
    }
}
```

#### C++

```cpp
class Solution {
public:
    long long maxScore(vector<int>& nums) {
        int n = nums.size();
        vector<long long> sufGcd(n + 1, 0);
        vector<long long> sufLcm(n + 1, 1);
        for (int i = n - 1; i >= 0; --i) {
            sufGcd[i] = gcd(sufGcd[i + 1], nums[i]);
            sufLcm[i] = lcm(sufLcm[i + 1], nums[i]);
        }

        long long ans = sufGcd[0] * sufLcm[0];
        long long preGcd = 0, preLcm = 1;
        for (int i = 0; i < n; ++i) {
            ans = max(ans, gcd(preGcd, sufGcd[i + 1]) * lcm(preLcm, sufLcm[i + 1]));
            preGcd = gcd(preGcd, nums[i]);
            preLcm = lcm(preLcm, nums[i]);
        }
        return ans;
    }
};
```

#### Go

```go
func maxScore(nums []int) int64 {
	n := len(nums)
	sufGcd := make([]int64, n+1)
	sufLcm := make([]int64, n+1)
	sufLcm[n] = 1
	for i := n - 1; i >= 0; i-- {
		sufGcd[i] = gcd(sufGcd[i+1], int64(nums[i]))
		sufLcm[i] = lcm(sufLcm[i+1], int64(nums[i]))
	}

	ans := sufGcd[0] * sufLcm[0]
	preGcd, preLcm := int64(0), int64(1)
	for i := 0; i < n; i++ {
		ans = max(ans, gcd(preGcd, sufGcd[i+1])*lcm(preLcm, sufLcm[i+1]))
		preGcd = gcd(preGcd, int64(nums[i]))
		preLcm = lcm(preLcm, int64(nums[i]))
	}
	return ans
}

func gcd(a, b int64) int64 {
	if b == 0 {
		return a
	}
	return gcd(b, a%b)
}

func lcm(a, b int64) int64 {
	return a / gcd(a, b) * b
}
```

#### TypeScript

```ts
function maxScore(nums: number[]): number {
    const n = nums.length;
    const sufGcd: number[] = Array(n + 1).fill(0);
    const sufLcm: number[] = Array(n + 1).fill(1);
    for (let i = n - 1; i >= 0; i--) {
        sufGcd[i] = gcd(sufGcd[i + 1], nums[i]);
        sufLcm[i] = lcm(sufLcm[i + 1], nums[i]);
    }

    let ans = sufGcd[0] * sufLcm[0];
    let preGcd = 0,
        preLcm = 1;
    for (let i = 0; i < n; i++) {
        ans = Math.max(ans, gcd(preGcd, sufGcd[i + 1]) * lcm(preLcm, sufLcm[i + 1]));
        preGcd = gcd(preGcd, nums[i]);
        preLcm = lcm(preLcm, nums[i]);
    }
    return ans;
}

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    return (a / gcd(a, b)) * b;
}
```

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->