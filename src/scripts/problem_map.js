// Map of LeetCode problem names to their numbers
const problemMap = {
    'two-sum': '0001',
    'add-two-numbers': '0002',
    'longest-substring-without-repeating-characters': '0003',
    'median-of-two-sorted-arrays': '0004',
    'longest-palindromic-substring': '0005',
    'zigzag-conversion': '0006',
    'reverse-integer': '0007',
    'string-to-integer-atoi': '0008',
    'palindrome-number': '0009',
    'regular-expression-matching': '0010',
    'container-with-most-water': '0011',
    'integer-to-roman': '0012',
    'roman-to-integer': '0013',
    'longest-common-prefix': '0014',
    '3sum': '0015',
    '3sum-closest': '0016',
    'letter-combinations-of-a-phone-number': '0017',
    '4sum': '0018',
    'remove-nth-node-from-end-of-list': '0019',
    'valid-parentheses': '0020',
    'merge-two-sorted-lists': '0021',
    'generate-parentheses': '0022',
    'merge-k-sorted-lists': '0023',
    'swap-nodes-in-pairs': '0024',
    'reverse-nodes-in-k-group': '0025',
    'remove-duplicates-from-sorted-array': '0026',
    'remove-element': '0027',
    'find-the-index-of-the-first-occurrence-in-a-string': '0028',
    'divide-two-integers': '0029',
    'substring-with-concatenation-of-all-words': '0030',
    'next-permutation': '0031',
    'longest-valid-parentheses': '0032',
    'search-in-rotated-sorted-array': '0033',
    'find-first-and-last-position-of-element-in-sorted-array': '0034',
    'search-insert-position': '0035',
    'valid-sudoku': '0036',
    'sudoku-solver': '0037',
    'count-and-say': '0038',
    'combination-sum': '0039',
    'combination-sum-ii': '0040',
    'first-missing-positive': '0041',
    'trapping-rain-water': '0042',
    'multiply-strings': '0043',
    'wildcard-matching': '0044',
    'jump-game-ii': '0045',
    'permutations': '0046',
    'permutations-ii': '0047',
    'rotate-image': '0048',
    'group-anagrams': '0049',
    'powx-n': '0050',
    'n-queens': '0051',
    'n-queens-ii': '0052',
    'maximum-subarray': '0053',
    'spiral-matrix': '0054',
    'jump-game': '0055',
    'merge-intervals': '0056',
    'insert-interval': '0057',
    'length-of-last-word': '0058',
    'spiral-matrix-ii': '0059',
    'permutation-sequence': '0060',
    'rotate-list': '0061',
    'unique-paths': '0062',
    'unique-paths-ii': '0063',
    'minimum-path-sum': '0064',
    'valid-number': '0065',
    'plus-one': '0066',
    'add-binary': '0067',
    'text-justification': '0068',
    'sqrtx': '0069',
    'climbing-stairs': '0070',
    'simplify-path': '0071',
    'edit-distance': '0072',
    'set-matrix-zeroes': '0073',
    'search-a-2d-matrix': '0074',
    'sort-colors': '0075',
    'minimum-window-substring': '0076',
    'combinations': '0077',
    'subsets': '0078',
    'word-search': '0079',
    'remove-duplicates-from-sorted-array-ii': '0080',
    'search-in-rotated-sorted-array-ii': '0081',
    'remove-duplicates-from-sorted-list-ii': '0082',
    'remove-duplicates-from-sorted-list': '0083',
    'largest-rectangle-in-histogram': '0084',
    'maximal-rectangle': '0085',
    'partition-list': '0086',
    'scramble-string': '0087',
    'merge-sorted-array': '0088',
    'gray-code': '0089',
    'subsets-ii': '0090',
    'decode-ways': '0091',
    'reverse-linked-list-ii': '0092',
    'restore-ip-addresses': '0093',
    'binary-tree-inorder-traversal': '0094',
    'unique-binary-search-trees-ii': '0095',
    'unique-binary-search-trees': '0096',
    'interleaving-string': '0097',
    'validate-binary-search-tree': '0098',
    'recover-binary-search-tree': '0099',
    'same-tree': '0100',
    'symmetric-tree': '0101',
    'binary-tree-level-order-traversal': '0102',
    'binary-tree-zigzag-level-order-traversal': '0103',
    'maximum-depth-of-binary-tree': '0104',
    'construct-binary-tree-from-preorder-and-inorder-traversal': '0105',
    'construct-binary-tree-from-inorder-and-postorder-traversal': '0106',
    'binary-tree-level-order-traversal-ii': '0107',
    'convert-sorted-array-to-binary-search-tree': '0108',
    'convert-sorted-list-to-binary-search-tree': '0109',
    'balanced-binary-tree': '0110',
    'minimum-depth-of-binary-tree': '0111',
    'path-sum': '0112',
    'path-sum-ii': '0113',
    'flatten-binary-tree-to-linked-list': '0114',
    'distinct-subsequences': '0115',
    'populating-next-right-pointers-in-each-node': '0116',
    'populating-next-right-pointers-in-each-node-ii': '0117',
    'pascals-triangle': '0118',
    'pascals-triangle-ii': '0119',
    'triangle': '0120',
    'best-time-to-buy-and-sell-stock': '0121',
    'best-time-to-buy-and-sell-stock-ii': '0122',
    'best-time-to-buy-and-sell-stock-iii': '0123',
    'binary-tree-maximum-path-sum': '0124',
    'valid-palindrome': '0125',
    'word-ladder-ii': '0126',
    'word-ladder': '0127',
    'longest-consecutive-sequence': '0128',
    'sum-root-to-leaf-numbers': '0129',
    'surrounded-regions': '0130',
    'palindrome-partitioning': '0131',
    'palindrome-partitioning-ii': '0132',
    'clone-graph': '0133',
    'gas-station': '0134',
    'candy': '0135',
    'single-number': '0136',
    'single-number-ii': '0137',
    'copy-list-with-random-pointer': '0138',
    'word-break': '0139',
    'word-break-ii': '0140',
    'linked-list-cycle': '0141',
    'linked-list-cycle-ii': '0142',
    'reorder-list': '0143',
    'binary-tree-preorder-traversal': '0144',
    'binary-tree-postorder-traversal': '0145',
    'lru-cache': '0146',
    'insertion-sort-list': '0147',
    'sort-list': '0148',
    'max-points-on-a-line': '0149',
    'evaluate-reverse-polish-notation': '0150',
    'reverse-words-in-a-string': '0151',
    'maximum-product-subarray': '0152',
    'find-minimum-in-rotated-sorted-array': '0153',
    'find-minimum-in-rotated-sorted-array-ii': '0154',
    'min-stack': '0155',
    'binary-tree-upside-down': '0156',
    'read-n-characters-given-read4': '0157',
    'read-n-characters-given-read4-ii-call-multiple-times': '0158',
    'longest-substring-with-at-most-two-distinct-characters': '0159',
    'intersection-of-two-linked-lists': '0160',
    'one-edit-distance': '0161',
    'find-peak-element': '0162',
    'missing-ranges': '0163',
    'maximum-gap': '0164',
    'compare-version-numbers': '0165',
    'fraction-to-recurring-decimal': '0166',
    'two-sum-ii-input-array-is-sorted': '0167',
    'excel-sheet-column-title': '0168',
    'majority-element': '0169',
    'two-sum-iii-data-structure-design': '0170',
    'excel-sheet-column-number': '0171',
    'factorial-trailing-zeroes': '0172',
    'binary-search-tree-iterator': '0173',
    'dungeon-game': '0174',
    'combine-two-tables': '0175',
    'second-highest-salary': '0176',
    'nth-highest-salary': '0177',
    'rank-scores': '0178',
    'largest-number': '0179',
    'consecutive-numbers': '0180',
    'employees-earning-more-than-their-managers': '0181',
    'duplicate-emails': '0182',
    'customers-who-never-order': '0183',
    'department-highest-salary': '0184',
    'department-top-three-salaries': '0185',
    'reverse-words-in-a-string-ii': '0186',
    'repeated-dna-sequences': '0187',
    'best-time-to-buy-and-sell-stock-iv': '0188',
    'rotate-array': '0189',
    'reverse-bits': '0190',
    'number-of-1-bits': '0191',
    'word-frequency': '0192',
    'valid-phone-numbers': '0193',
    'transpose-file': '0194',
    'tenth-line': '0195',
    'delete-duplicate-emails': '0196',
    'rising-temperature': '0197',
    'house-robber': '0198',
    'binary-tree-right-side-view': '0199',
    'number-of-islands': '0200',
    'bitwise-and-of-numbers-range': '0201',
    'happy-number': '0202',
    'remove-linked-list-elements': '0203',
    'count-primes': '0204',
    'isomorphic-strings': '0205',
    'reverse-linked-list': '0206',
    'course-schedule': '0207',
    'implement-trie-prefix-tree': '0208',
    'minimum-size-subarray-sum': '0209',
    'course-schedule-ii': '0210',
    'design-add-and-search-words-data-structure': '0211',
    'word-search-ii': '0212',
    'house-robber-ii': '0213',
    'shortest-palindrome': '0214',
    'kth-largest-element-in-an-array': '0215',
    'combination-sum-iii': '0216',
    'contains-duplicate': '0217',
    'the-skyline-problem': '0218',
    'contains-duplicate-ii': '0219',
    'contains-duplicate-iii': '0220',
    'maximal-square': '0221',
    'count-complete-tree-nodes': '0222',
    'rectangle-area': '0223',
    'basic-calculator': '0224',
    'implement-stack-using-queues': '0225',
    'invert-binary-tree': '0226',
    'basic-calculator-ii': '0227',
    'summary-ranges': '0228',
    'majority-element-ii': '0229',
    'kth-smallest-element-in-a-bst': '0230',
    'power-of-two': '0231',
    'implement-queue-using-stacks': '0232',
    'number-of-digit-one': '0233',
    'palindrome-linked-list': '0234',
    'lowest-common-ancestor-of-a-binary-search-tree': '0235',
    'lowest-common-ancestor-of-a-binary-tree': '0236',
    'delete-node-in-a-linked-list': '0237',
    'product-of-array-except-self': '0238',
    'sliding-window-maximum': '0239',
    'search-a-2d-matrix-ii': '0240',
    'different-ways-to-add-parentheses': '0241',
    'valid-anagram': '0242',
    'shortest-word-distance': '0243',
    'shortest-word-distance-ii': '0244',
    'shortest-word-distance-iii': '0245',
    'strobogrammatic-number': '0246',
    'strobogrammatic-number-ii': '0247',
    'strobogrammatic-number-iii': '0248',
    'group-shifted-strings': '0249',
    'count-univalue-subtrees': '0250',
    'flatten-2d-vector': '0251',
    'meeting-rooms': '0252',
    'meeting-rooms-ii': '0253',
    'factor-combinations': '0254',
    'verify-preorder-sequence-in-binary-search-tree': '0255',
    'paint-house': '0256',
    'binary-tree-paths': '0257',
    'add-digits': '0258',
    '3sum-smaller': '0259',
    'single-number-iii': '0260',
    'graph-valid-tree': '0261',
    'trips-and-users': '0262',
    'ugly-number': '0263',
    'ugly-number-ii': '0264',
    'paint-house-ii': '0265',
    'palindrome-permutation': '0266',
    'palindrome-permutation-ii': '0267',
    'missing-number': '0268',
    'alien-dictionary': '0269',
    'closest-binary-search-tree-value': '0270',
    'encode-and-decode-strings': '0271',
    'closest-binary-search-tree-value-ii': '0272',
    'integer-to-english-words': '0273',
    'h-index': '0274',
    'h-index-ii': '0275',
    'paint-fence': '0276',
    'find-the-celebrity': '0277',
    'first-bad-version': '0278',
    'perfect-squares': '0279',
    'wiggle-sort': '0280',
    'zigzag-iterator': '0281',
    'expression-add-operators': '0282',
    'move-zeroes': '0283',
    'peeking-iterator': '0284',
    'inorder-successor-in-bst': '0285',
    'walls-and-gates': '0286',
    'find-the-duplicate-number': '0287',
    'unique-word-abbreviation': '0288',
    'game-of-life': '0289',
    'word-pattern': '0290',
    'word-pattern-ii': '0291',
    'nim-game': '0292',
    'flip-game': '0293',
    'flip-game-ii': '0294',
    'find-median-from-data-stream': '0295',
    'best-meeting-point': '0296',
    'serialize-and-deserialize-binary-tree': '0297',
    'binary-tree-longest-consecutive-sequence': '0298',
    'bulls-and-cows': '0299',
    'longest-increasing-subsequence': '0300',
    'remove-invalid-parentheses': '0301',
    'smallest-rectangle-enclosing-black-pixels': '0302',
    'range-sum-query-immutable': '0303',
    'range-sum-query-2d-immutable': '0304',
    'number-of-islands-ii': '0305',
    'additive-number': '0306',
    'range-sum-query-mutable': '0307',
    'range-sum-query-2d-mutable': '0308',
    'best-time-to-buy-and-sell-stock-with-cooldown': '0309',
    'minimum-height-trees': '0310',
    'sparse-matrix-multiplication': '0311',
    'burst-balloons': '0312',
    'super-ugly-number': '0313',
    'binary-tree-vertical-order-traversal': '0314',
    'count-of-smaller-numbers-after-self': '0315',
    'remove-duplicate-letters': '0316',
    'shortest-distance-from-all-buildings': '0317',
    'maximum-product-of-word-lengths': '0318',
    'bulb-switcher': '0319',
    'generalized-abbreviation': '0320',
    'create-maximum-number': '0321',
    'coin-change': '0322',
    'number-of-connected-components-in-an-undirected-graph': '0323',
    'wiggle-sort-ii': '0324',
    'maximum-size-subarray-sum-equals-k': '0325',
    'power-of-three': '0326',
    'count-of-range-sum': '0327',
    'odd-even-linked-list': '0328',
    'longest-increasing-path-in-a-matrix': '0329',
    'patching-array': '0330',
    'verify-preorder-serialization-of-a-binary-tree': '0331',
    'reconstruct-itinerary': '0332',
    'largest-bst-subtree': '0333',
    'increasing-triplet-subsequence': '0334',
    'self-crossing': '0335',
    'palindrome-pairs': '0336',
    'house-robber-iii': '0337',
    'counting-bits': '0338',
    'nested-list-weight-sum': '0339',
    'longest-substring-with-at-most-k-distinct-characters': '0340',
    'flatten-nested-list-iterator': '0341',
    'power-of-four': '0342',
    'integer-break': '0343',
    'reverse-string': '0344',
    'reverse-vowels-of-a-string': '0345',
    'moving-average-from-data-stream': '0346',
    'top-k-frequent-elements': '0347',
    'design-tic-tac-toe': '0348',
    'intersection-of-two-arrays': '0349',
    'intersection-of-two-arrays-ii': '0350',
    'android-unlock-patterns': '0351',
    'data-stream-as-disjoint-intervals': '0352',
    'design-snake-game': '0353',
    'russian-doll-envelopes': '0354',
    'design-twitter': '0355',
    'line-reflection': '0356',
    'count-numbers-with-unique-digits': '0357',
    'rearrange-string-k-distance-apart': '0358',
    'logger-rate-limiter': '0359',
    'sort-transformed-array': '0360',
    'bomb-enemy': '0361',
    'design-hit-counter': '0362',
    'max-sum-of-rectangle-no-larger-than-k': '0363',
    'nested-list-weight-sum-ii': '0364',
    'water-and-jug-problem': '0365',
    'find-leaves-of-binary-tree': '0366',
    'valid-perfect-square': '0367',
    'largest-divisible-subset': '0368',
    'plus-one-linked-list': '0369',
    'range-addition': '0370',
    'sum-of-two-integers': '0371',
    'super-pow': '0372',
    'find-k-pairs-with-smallest-sums': '0373',
    'guess-number-higher-or-lower': '0374',
    'guess-number-higher-or-lower-ii': '0375',
    'wiggle-subsequence': '0376',
    'combination-sum-iv': '0377',
    'kth-smallest-element-in-a-sorted-matrix': '0378',
    'design-phone-directory': '0379',
    'insert-delete-getrandom-o1': '0380',
    'insert-delete-getrandom-o1-duplicates-allowed': '0381',
    'linked-list-random-node': '0382',
    'ransom-note': '0383',
    'shuffle-an-array': '0384',
    'mini-parser': '0385',
    'lexicographical-numbers': '0386',
    'first-unique-character-in-a-string': '0387',
    'longest-absolute-file-path': '0388',
    'find-the-difference': '0389',
    'elimination-game': '0390',
    'perfect-rectangle': '0391',
    'is-subsequence': '0392',
    'utf-8-validation': '0393',
    'decode-string': '0394',
    'longest-substring-with-at-least-k-repeating-characters': '0395',
    'rotate-function': '0396',
    'integer-replacement': '0397',
    'random-pick-index': '0398',
    'evaluate-division': '0399',
    'nth-digit': '0400',
    'binary-watch': '0401',
    'remove-k-digits': '0402',
    'frog-jump': '0403',
    'sum-of-left-leaves': '0404',
    'convert-a-number-to-hexadecimal': '0405',
    'queue-reconstruction-by-height': '0406',
    'trapping-rain-water-ii': '0407',
    'valid-word-abbreviation': '0408',
    'longest-palindrome': '0409',
    'split-array-largest-sum': '0410',
    'minimum-unique-word-abbreviation': '0411',
    'fizz-buzz': '0412',
    'arithmetic-slices': '0413',
    'third-maximum-number': '0414',
    'add-strings': '0415',
    'partition-equal-subset-sum': '0416',
    'pacific-atlantic-water-flow': '0417',
    'sentence-screen-fitting': '0418',
    'battleships-in-a-board': '0419',
    'strong-password-checker': '0420',
    'maximum-xor-of-two-numbers-in-an-array': '0421',
    'valid-word-square': '0422',
    'reconstruct-original-digits-from-english': '0423',
    'longest-repeating-character-replacement': '0424',
    'word-squares': '0425',
    'convert-binary-search-tree-to-sorted-doubly-linked-list': '0426',
    'construct-quad-tree': '0427',
    'serialize-and-deserialize-n-ary-tree': '0428',
    'n-ary-tree-level-order-traversal': '0429',
    'flatten-a-multilevel-doubly-linked-list': '0430',
    'encode-n-ary-tree-to-binary-tree': '0431',
    'all-oone-data-structure': '0432',
    'minimum-genetic-mutation': '0433',
    'number-of-segments-in-a-string': '0434',
    'non-overlapping-intervals': '0435',
    'find-right-interval': '0436',
    'path-sum-iii': '0437',
    'find-all-anagrams-in-a-string': '0438',
    'ternary-expression-parser': '0439',
    'k-th-smallest-in-lexicographical-order': '0440',
    'arranging-coins': '0441',
    'find-all-duplicates-in-an-array': '0442',
    'string-compression': '0443',
    'sequence-reconstruction': '0444',
    'add-two-numbers-ii': '0445',
    'arithmetic-slices-ii-subsequence': '0446',
    'number-of-boomerangs': '0447',
    'find-all-numbers-disappeared-in-an-array': '0448',
    'serialize-and-deserialize-bst': '0449',
    'delete-node-in-a-bst': '0450',
    'sort-characters-by-frequency': '0451',
    'minimum-number-of-arrows-to-burst-balloons': '0452',
    'minimum-moves-to-equal-array-elements': '0453',
    '4sum-ii': '0454',
    'assign-cookies': '0455',
    '132-pattern': '0456',
    'circular-array-loop': '0457',
    'poor-pigs': '0458',
    'repeated-substring-pattern': '0459',
    'lfu-cache': '0460',
    'hamming-distance': '0461',
    'minimum-moves-to-equal-array-elements-ii': '0462',
    'island-perimeter': '0463',
    'can-i-win': '0464',
    'optimal-account-balancing': '0465',
    'count-the-repetitions': '0466',
    'unique-substrings-in-wraparound-string': '0467',
    'validate-ip-address': '0468',
    'convex-polygon': '0469',
    'implement-rand10-using-rand7': '0470',
    'encode-string-with-shortest-length': '0471',
    'concatenated-words': '0472',
    'matchsticks-to-square': '0473',
    'ones-and-zeroes': '0474',
    'heaters': '0475',
    'number-complement': '0476',
    'total-hamming-distance': '0477',
    'generate-random-point-in-a-circle': '0478',
    'largest-palindrome-product': '0479',
    'sliding-window-median': '0480',
    'magical-string': '0481',
    'license-key-formatting': '0482',
    'smallest-good-base': '0483',
    'find-permutation': '0484',
    'max-consecutive-ones': '0485',
    'predict-the-winner': '0486',
    'max-consecutive-ones-ii': '0487',
    'zuma-game': '0488',
    'robot-room-cleaner': '0489',
    'the-maze': '0490',
    'non-decreasing-subsequences': '0491',
    'construct-the-rectangle': '0492',
    'reverse-pairs': '0493',
    'target-sum': '0494',
    'teemo-attacking': '0495',
    'next-greater-element-i': '0496',
    'random-point-in-non-overlapping-rectangles': '0497',
    'diagonal-traverse': '0498',
    'the-maze-iii': '0499',
    'keyboard-row': '0500',
    'find-mode-in-binary-search-tree': '0501',
    'ipo': '0502',
    'next-greater-element-ii': '0503',
    'base-7': '0504',
    'the-maze-ii': '0505',
    'relative-ranks': '0506',
    'perfect-number': '0507',
    'most-frequent-subtree-sum': '0508',
    'fibonacci-number': '0509',
    'inorder-successor-in-bst-ii': '0510',
    'game-play-analysis-i': '0511',
    'game-play-analysis-ii': '0512',
    'find-bottom-left-tree-value': '0513',
    'freedom-trail': '0514',
    'find-largest-value-in-each-tree-row': '0515',
    'longest-palindromic-subsequence': '0516',
    'super-washing-machines': '0517',
    'coin-change-ii': '0518',
    'random-flip-matrix': '0519',
    'detect-capital': '0520',
    'longest-uncommon-subsequence-i': '0521',
    'longest-uncommon-subsequence-ii': '0522',
    'continuous-subarray-sum': '0523',
    'longest-word-in-dictionary-through-deleting': '0524',
    'contiguous-array': '0525',
    'beautiful-arrangement': '0526',
    'word-abbreviation': '0527',
    'random-pick-with-weight': '0528',
    'minesweeper': '0529',
    'minimum-absolute-difference-in-bst': '0530',
    'lonely-pixel-i': '0531',
    'k-diff-pairs-in-an-array': '0532',
    'lonely-pixel-ii': '0533',
    'game-play-analysis-iii': '0534',
    'encode-and-decode-tinyurl': '0535',
    'construct-binary-tree-from-string': '0536',
    'complex-number-multiplication': '0537',
    'convert-bst-to-greater-tree': '0538',
    'minimum-time-difference': '0539',
    'single-element-in-a-sorted-array': '0540',
    'reverse-string-ii': '0541',
    '01-matrix': '0542',
    'diameter-of-binary-tree': '0543',
    'output-contest-matches': '0544',
    'boundary-of-binary-tree': '0545',
    'remove-boxes': '0546',
    'number-of-provinces': '0547',
    'split-array-with-equal-sum': '0548',
    'binary-tree-longest-consecutive-sequence-ii': '0549',
    'game-play-analysis-iv': '0550',
    'student-attendance-record-i': '0551',
    'student-attendance-record-ii': '0552',
    'optimal-division': '0553',
    'brick-wall': '0554',
    'split-concatenated-strings': '0555',
    'next-greater-element-iii': '0556',
    'reverse-words-in-a-string-iii': '0557',
    'logical-or-of-two-binary-grids-represented-as-quad-trees': '0558',
    'maximum-depth-of-n-ary-tree': '0559',
    'subarray-sum-equals-k': '0560',
    'array-partition': '0561',
    'longest-line-of-consecutive-one-in-matrix': '0562',
    'binary-tree-tilt': '0563',
    'find-the-closest-palindrome': '0564',
    'array-nesting': '0565',
    'reshape-the-matrix': '0566',
    'permutation-in-string': '0567',
    'maximum-vacation-days': '0568',
    'median-employee-salary': '0569',
    'managers-with-at-least-5-direct-reports': '0570',
    'find-median-given-frequency-of-numbers': '0571',
    'subtree-of-another-tree': '0572',
    'squirrel-simulation': '0573',
    'winning-candidate': '0574',
    'distribute-candies': '0575',
    'out-of-boundary-paths': '0576',
    'employee-bonus': '0577',
    'get-highest-answer-rate-question': '0578',
    'find-cumulative-salary-of-an-employee': '0579',
    'count-student-number-in-departments': '0580',
    'shortest-unsorted-continuous-subarray': '0581',
    'kill-process': '0582',
    'delete-operation-for-two-strings': '0583',
    'find-customer-referee': '0584',
    'investments-in-2016': '0585',
    'customer-placing-the-largest-number-of-orders': '0586',
    'erect-the-fence': '0587',
    'design-in-memory-file-system': '0588',
    'n-ary-tree-preorder-traversal': '0589',
    'n-ary-tree-postorder-traversal': '0590',
    'tag-validator': '0591',
    'fraction-addition-and-subtraction': '0592',
    'valid-square': '0593',
    'longest-harmonious-subsequence': '0594',
    'big-countries': '0595',
    'classes-more-than-5-students': '0596',
    'friend-requests-i-overall-acceptance-rate': '0597',
    'range-addition-ii': '0598',
    'minimum-index-sum-of-two-lists': '0599',
    'non-negative-integers-without-consecutive-ones': '0600',
    'human-traffic-of-stadium': '0601',
    'friend-requests-ii-who-has-the-most-friends': '0602',
    'consecutive-available-seats': '0603',
    'design-compressed-string-iterator': '0604',
    'can-place-flowers': '0605',
    'construct-string-from-binary-tree': '0606',
    'sales-person': '0607',
    'tree-node': '0608',
    'find-duplicate-file-in-system': '0609',
    'triangle-judgement': '0610',
    'valid-triangle-number': '0611',
    'shortest-distance-in-a-plane': '0612',
    'shortest-distance-in-a-line': '0613',
    'second-degree-follower': '0614',
    'average-salary-departments-vs-company': '0615',
    'add-bold-tag-in-string': '0616',
    'merge-two-binary-trees': '0617',
    'students-report-by-geography': '0618',
    'biggest-single-number': '0619',
    'not-boring-movies': '0620',
    'task-scheduler': '0621',
    'design-circular-queue': '0622',
    'add-one-row-to-tree': '0623',
    'maximum-distance-in-arrays': '0624',
    'minimum-factorization': '0625',
    'exchange-seats': '0626',
    'swap-salary': '0627',
    'maximum-product-of-three-numbers': '0628',
    'k-inverse-pairs-array': '0629',
    'course-schedule-iii': '0630',
    'design-excel-sum-formula': '0631',
    'smallest-range-covering-elements-from-k-lists': '0632',
    'sum-of-square-numbers': '0633',
    'find-the-derangement-of-an-array': '0634',
    'design-log-storage-system': '0635',
    'exclusive-time-of-functions': '0636',
    'average-of-levels-in-binary-tree': '0637',
    'shopping-offers': '0638',
    'decode-ways-ii': '0639',
    'solve-the-equation': '0640',
    'design-circular-deque': '0641',
    'design-search-autocomplete-system': '0642',
    'maximum-average-subarray-i': '0643',
    'maximum-average-subarray-ii': '0644',
    'set-mismatch': '0645',
    'maximum-length-of-pair-chain': '0646',
    'palindromic-substrings': '0647',
    'replace-words': '0648',
    'dota2-senate': '0649',
    '2-keys-keyboard': '0650',
    '4-keys-keyboard': '0651',
    'find-duplicate-subtrees': '0652',
    'two-sum-iv-input-is-a-bst': '0653',
    'maximum-binary-tree': '0654',
    'print-binary-tree': '0655',
    'coin-path': '0656',
    'robot-return-to-origin': '0657',
    'find-k-closest-elements': '0658',
    'split-array-into-consecutive-subsequences': '0659',
    'remove-9': '0660',
    'image-smoother': '0661',
    'maximum-width-of-binary-tree': '0662',
    'equal-tree-partition': '0663',
    'strange-printer': '0664',
    'non-decreasing-array': '0665',
    'path-sum-iv': '0666',
    'beautiful-arrangement-ii': '0667',
    'kth-smallest-number-in-multiplication-table': '0668',
    'trim-a-binary-search-tree': '0669',
    'maximum-swap': '0670',
    'second-minimum-node-in-a-binary-tree': '0671',
    'bulb-switcher-ii': '0672',
    'number-of-longest-increasing-subsequence': '0673',
    'longest-continuous-increasing-subsequence': '0674',
    'cut-off-trees-for-golf-event': '0675',
    'implement-magic-dictionary': '0676',
    'map-sum-pairs': '0677',
    'valid-parenthesis-string': '0678',
    '24-game': '0679',
    'valid-palindrome-ii': '0680',
    'next-closest-time': '0681',
    'baseball-game': '0682',
    'k-empty-slots': '0683',
    'redundant-connection': '0684',
    'redundant-connection-ii': '0685',
    'repeated-string-match': '0686',
    'longest-univalue-path': '0687',
    'knight-probability-in-chessboard': '0688',
    'maximum-sum-of-3-non-overlapping-subarrays': '0689',
    'employee-importance': '0690',
    'stickers-to-spell-word': '0691',
    'top-k-frequent-words': '0692',
    'binary-number-with-alternating-bits': '0693',
    'number-of-distinct-islands': '0694',
    'max-area-of-island': '0695',
    'count-binary-substrings': '0696',
    'degree-of-an-array': '0697',
    'partition-to-k-equal-sum-subsets': '0698',
    'falling-squares': '0699',
    'search-in-a-binary-search-tree': '0700',
    'insert-into-a-binary-search-tree': '0701',
    'search-in-a-sorted-array-of-unknown-size': '0702',
    'kth-largest-element-in-a-stream': '0703',
    'binary-search': '0704',
    'design-hashset': '0705',
    'design-hashmap': '0706',
    'design-linked-list': '0707',
    'insert-into-a-sorted-circular-linked-list': '0708',
    'to-lower-case': '0709',
    'random-pick-with-blacklist': '0710',
    'number-of-distinct-islands-ii': '0711',
    'minimum-ascii-delete-sum-for-two-strings': '0712',
    'subarray-product-less-than-k': '0713',
    'best-time-to-buy-and-sell-stock-with-transaction-fee': '0714',
    'range-module': '0715',
    'max-stack': '0716',
    '1-bit-and-2-bit-characters': '0717',
    'maximum-length-of-repeated-subarray': '0718',
    'find-k-th-smallest-pair-distance': '0719',
    'longest-word-in-dictionary': '0720',
    'accounts-merge': '0721',
    'remove-comments': '0722',
    'candy-crush': '0723',
    'find-pivot-index': '0724',
    'split-linked-list-in-parts': '0725',
    'number-of-atoms': '0726',
    'minimum-window-subsequence': '0727',
    'self-dividing-numbers': '0728',
    'my-calendar-i': '0729',
    'count-different-palindromic-subsequences': '0730',
    'my-calendar-ii': '0731',
    'my-calendar-iii': '0732',
    'flood-fill': '0733',
    'sentence-similarity': '0734',
    'asteroid-collision': '0735',
    'parse-lisp-expression': '0736',
    'sentence-similarity-ii': '0737',
    'monotone-increasing-digits': '0738',
    'daily-temperatures': '0739',
    'delete-and-earn': '0740',
    'cherry-pickup': '0741',
    'closest-leaf-in-a-binary-tree': '0742',
    'network-delay-time': '0743',
    'find-smallest-letter-greater-than-target': '0744',
    'prefix-and-suffix-search': '0745',
    'min-cost-climbing-stairs': '0746',
    'largest-number-at-least-twice-of-others': '0747',
    'shortest-completing-word': '0748',
    'contain-virus': '0749',
    'number-of-corner-rectangles': '0750',
    'ip-to-cidr': '0751',
    'open-the-lock': '0752',
    'cracking-the-safe': '0753',
    'reach-a-number': '0754',
    'pour-water': '0755',
    'pyramid-transition-matrix': '0756',
    'set-intersection-size-at-least-two': '0757',
    'bold-words-in-string': '0758',
    'employee-free-time': '0759',
    'find-anagram-mappings': '0760',
    'special-binary-string': '0761',
    'prime-number-of-set-bits-in-binary-representation': '0762',
    'partition-labels': '0763',
    'largest-plus-sign': '0764',
    'couples-holding-hands': '0765',
    'toeplitz-matrix': '0766',
    'reorganize-string': '0767',
    'max-chunks-to-make-sorted-ii': '0768',
    'max-chunks-to-make-sorted': '0769',
    'basic-calculator-iv': '0770',
    'jewels-and-stones': '0771',
    'basic-calculator-iii': '0772',
    'sliding-puzzle': '0773',
    'minimize-max-distance-to-gas-station': '0774',
    'global-and-local-inversions': '0775',
    'split-bst': '0776',
    'swap-adjacent-in-lr-string': '0777',
    'swim-in-rising-water': '0778',
    'k-th-symbol-in-grammar': '0779',
    'reaching-points': '0780',
    'rabbits-in-forest': '0781',
    'transform-to-chessboard': '0782',
    'minimum-distance-between-bst-nodes': '0783',
    'letter-case-permutation': '0784',
    'is-graph-bipartite': '0785',
    'k-th-smallest-prime-fraction': '0786',
    'cheapest-flights-within-k-stops': '0787',
    'rotated-digits': '0788',
    'escape-the-ghosts': '0789',
    'domino-and-tromino-tiling': '0790',
    'custom-sort-string': '0791',
    'number-of-matching-subsequences': '0792',
    'preimage-size-of-factorial-zeroes-function': '0793',
    'valid-tic-tac-toe-state': '0794',
    'number-of-subarrays-with-bounded-maximum': '0795',
    'rotate-string': '0796',
    'all-paths-from-source-to-target': '0797',
    'smallest-rotation-with-highest-score': '0798',
    'champagne-tower': '0799',
    'similar-rgb-color': '0800',
    'minimum-swaps-to-make-sequences-increasing': '0801',
    'find-eventual-safe-states': '0802',
    'bricks-falling-when-hit': '0803',
    'unique-morse-code-words': '0804',
    'split-array-with-same-average': '0805',
    'number-of-lines-to-write-string': '0806',
    'max-increase-to-keep-city-skyline': '0807',
    'soup-servings': '0808',
    'expressive-words': '0809',
    'chalkboard-xor-game': '0810',
    'subdomain-visit-count': '0811',
    'largest-triangle-area': '0812',
    'largest-sum-of-averages': '0813',
    'binary-tree-pruning': '0814',
    'bus-routes': '0815',
    'ambiguous-coordinates': '0816',
    'linked-list-components': '0817',
    'race-car': '0818',
    'most-common-word': '0819',
    'short-encoding-of-words': '0820',
    'shortest-distance-to-a-character': '0821',
    'card-flipping-game': '0822',
    'binary-trees-with-factors': '0823',
    'goat-latin': '0824',
    'friends-of-appropriate-ages': '0825',
    'most-profit-assigning-work': '0826',
    'making-a-large-island': '0827',
    'count-unique-characters-of-all-substrings-of-a-given-string': '0828',
    'consecutive-numbers-sum': '0829',
    'positions-of-large-groups': '0830',
    'masking-personal-information': '0831',
    'flipping-an-image': '0832',
    'find-and-replace-in-string': '0833',
    'sum-of-distances-in-tree': '0834',
    'image-overlap': '0835',
    'rectangle-overlap': '0836',
    'new-21-game': '0837',
    'push-dominoes': '0838',
    'similar-string-groups': '0839',
    'magic-squares-in-grid': '0840',
    'keys-and-rooms': '0841',
    'split-array-into-fibonacci-sequence': '0842',
    'guess-the-word': '0843',
    'backspace-string-compare': '0844',
    'longest-mountain-in-array': '0845',
    'hand-of-straights': '0846',
    'shortest-path-visiting-all-nodes': '0847',
    'shifting-letters': '0848',
    'maximize-distance-to-closest-person': '0849',
    'rectangle-area-ii': '0850',
    'loud-and-rich': '0851',
    'peak-index-in-a-mountain-array': '0852',
    'car-fleet': '0853',
    'k-similar-strings': '0854',
    'exam-room': '0855',
    'score-of-parentheses': '0856',
    'minimum-cost-to-hire-k-workers': '0857',
    'mirror-reflection': '0858',
    'buddy-strings': '0859',
    'lemonade-change': '0860',
    'score-after-flipping-matrix': '0861',
    'shortest-subarray-with-sum-at-least-k': '0862',
    'all-nodes-distance-k-in-binary-tree': '0863',
    'shortest-path-to-get-all-keys': '0864',
    'smallest-subtree-with-all-the-deepest-nodes': '0865',
    'prime-palindrome': '0866',
    'transpose-matrix': '0867',
    'binary-gap': '0868',
    'reordered-power-of-2': '0869',
    'advantage-shuffle': '0870',
    'minimum-number-of-refueling-stops': '0871',
    'leaf-similar-trees': '0872',
    'length-of-longest-fibonacci-subsequence': '0873',
    'walking-robot-simulation': '0874',
    'koko-eating-bananas': '0875',
    'middle-of-the-linked-list': '0876',
    'stone-game': '0877',
    'nth-magical-number': '0878',
    'profitable-schemes': '0879',
    'decoded-string-at-index': '0880',
    'boats-to-save-people': '0881',
    'reachable-nodes-in-subdivided-graph': '0882',
    'projection-area-of-3d-shapes': '0883',
    'uncommon-words-from-two-sentences': '0884',
    'spiral-matrix-iii': '0885',
    'possible-bipartition': '0886',
    'super-egg-drop': '0887',
    'fair-candy-swap': '0888',
    'construct-binary-tree-from-preorder-and-postorder-traversal': '0889',
    'find-and-replace-pattern': '0890',
    'sum-of-subsequence-widths': '0891',
    'surface-area-of-3d-shapes': '0892',
    'groups-of-special-equivalent-strings': '0893',
    'all-possible-full-binary-trees': '0894',
    'maximum-frequency-stack': '0895',
    'monotonic-array': '0896',
    'increasing-order-search-tree': '0897',
    'bitwise-ors-of-subarrays': '0898',
    'orderly-queue': '0899'
};

// Function to get problem number from problem name
function getProblemNumber(problemName) {
    return problemMap[problemName.toLowerCase()];
}

// Function to get problem range folder (e.g., '0000-0099')
function getProblemRange(problemNumber) {
    if (!problemNumber) return null;
    const num = parseInt(problemNumber);
    const start = Math.floor(num / 100) * 100;
    const end = start + 99;
    return `${start.toString().padStart(4, '0')}-${end.toString().padStart(4, '0')}`;
}

// Export the functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getProblemNumber,
        getProblemRange,
        problemMap
    };
}