var subscribers = [];

export function addSubscriber(subscriber, name) {
    subscribers.push({subscriber, name})
}

export function unsubscribeAll() {
    subscribers.forEach(subscriber => {
        subscriber.subscriber()
    });
    subscribers = [];
}

export function getSubscribers() {
    return subscribers;
}

export function unsubscribeByName(name, silent=false) {
    const subscriber = subscribers.find(s => s.name === name)
    if (!subscriber && !silent) {
        throw new Error("Cannot unsubscribe for a non-existing subscriber.")
    } else if (!subscriber && silent) return;
    subscribers = subscribers.filter(s => s.name !== name)
}

