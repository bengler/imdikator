
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
  pruneNoneForChart:
  [
    { 
      category: "a2",
      values: ["b2", "b3"],
      data: {
        value: {
          b2: ["foo", "baz"],
          b3: ["bar", "qux"]
        },
        value2: {
          b2: ["foo2", "baz2"],
          b3: ["bar2", "qux2"]
        }
      }
    },
    {
      category: "a1",
      values: ["b1", "b2"]
    }
  ],
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
  pruneA2resultForChart:
  [
    { 
      category: "a1",
      values: ["b1", "b2"],
      data: {
        value: {
          b1: ["foo"],
          b2: ["bar"]
        },
        value2: {
          b1: ["foo2"],
          b2: ["bar2"]
        }
      }
    },
  ],
  timeSeriesSource:
  {
    a1: {
      b1: {
        value: ["a1", "a2", "a3"],
        value2: ["x1", "y2", "z3"]
      },
      b2: {
        value: ["a1", "a2", "a3"],
        value2: ["x1", "y2", "z3"]
      }
    }
  },
  timeSeriesChartData:
  [
    { 
      category: "a1",
      values: ["b1", "b2"],
      data: {
        value: {
          b1: ["a1", "a2", "a3"],
          b2: ["a1", "a2", "a3"]
        },
        value2: {
          b1: ["x1", "y2", "z3"],
          b2: ["x1", "y2", "z3"]
        }
      }
    },
  ],
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
  },
  depthMeasure:
  { 
    a1: {
      b1: {
        a2: {
          b2: {
            a3: {
              b4: {
                value: ["foo"],
                value2: ["foo2"]
              },
              b3: {
                value: ["bar"],
                value2: ["bar2"]
              }
            }
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
};
