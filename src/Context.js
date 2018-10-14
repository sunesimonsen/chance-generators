class Context {
  get(key) {
    return this.data && this.data[key];
  }

  set(key, value) {
    if (!this.data) {
      this.data = Object.create(null);
    }
    this.data[key] = value;

    return this;
  }

  has(key) {
    return this.data && key in this.data;
  }

  isEmpty() {
    return !this.data && !this.childContexts;
  }

  childContext(key) {
    if (!this.childContexts) {
      this.childContexts = [];
    }

    for (var i = 0; i < this.childContexts.length; i += 1) {
      const entry = this.childContexts[i];
      if (entry.key === key) {
        return entry.context;
      }
    }

    const context = new Context();
    this.childContexts.push({ key, context });
    return context;
  }
}

module.exports = Context;
