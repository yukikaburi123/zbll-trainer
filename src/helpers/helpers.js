export const random_element = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
}

// shuffles array in place
export const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// "H RLFF OsA" -> "H-RLFF O/A"
export const formatZbllKey = key => {
    const [oll, coll, zbll] = key.split(' ');
    return `${oll}-${coll} ${zbll.replace('s', '/')}`;
}

export function areSetsEqual(setA, setB) {
    return setA.size === setB.size && [...setA].every(item => setB.has(item));
}
export const weighted_random_element = (arr, getWeight) => {
  let total = 0;

  for (const el of arr) {
    total += Math.max(0, getWeight(el));
  }

  // fallback to normal random if all weights are 0
  if (total <= 0) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  let r = Math.random() * total;

  for (const el of arr) {
    r -= Math.max(0, getWeight(el));
    if (r <= 0) return el;
  }

  return arr[arr.length - 1];
};