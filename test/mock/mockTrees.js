
export default {
  pruneNone:
  { 
    a1: {
      b1: {
        a2: {
          b2: {
            value: ["foo"],
            value2: ["foo2"]
          },
          b3: {
            value: ["bar"],
            value2: ["bar2"]
          }
        }
      },
      b2: {
        a2: {
          b2: {
            value: ["baz"],
            value2: ["baz2"]
          },
          b3: {
            value: ["qux"],
            value2: ["qux2"]
          }
        }
      }
    }
  },
  pruneA2:
  {
    a1: {
      b1: {
        a2: {
          b2: {
            value: ["foo"],
            value2: ["foo2"]
          },
        }
      },
      b2: {
        a2: {
          b2: {
            value: ["bar"],
            value2: ["bar2"]
          }
        }
      }
    }
  },
  pruneA2result:
  {
    a1: {
      b1: {
        value: ["foo"],
        value2: ["foo2"]
      },
      b2: {
        value: ["bar"],
        value2: ["bar2"]
      }
    }
  },
  pruneA1:
  {
    a1: {
      b1: {
        a2: {
          b2: {
            value: ["foo"],
            value2: ["foo2"]
          },
          b3: {
            value: ["baz"],
            value2: ["baz2"]
          }
        }
      }
    }
  },
  pruneA1Result:
  {
    a2: {
      b2: {
        value: ["foo"],
        value2: ["foo2"]
      },
      b3: {
        value: ["baz"],
        value2: ["baz2"]
      }
    }
  }
};
