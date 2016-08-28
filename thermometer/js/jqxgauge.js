(function(d) {
    var b = {
        defineInstance: function() {
            var e = {
                width: 350,
                height: 350,
                radius: "50%",
                endAngle: 270,
                startAngle: 30,
                int64: false,
                editableLabels: false,
                value: 0,
                min: 0,
                max: 120,
                disabled: false,
                ticksDistance: "20%",
                colorScheme: "scheme01",
                animationDuration: 400,
                showRanges: true,
                easing: "easeOutCubic",
                labels: null,
                pointer: null,
                cap: null,
                caption: null,
                border: null,
                ticksMinor: null,
                ticksMajor: null,
                tickMode: "default",
                niceInterval: false,
                style: null,
                ranges: [],
                _radius: 100,
                _border: null,
                _radiusDifference: 2,
                _pointer: null,
                _labels: [],
                _cap: null,
                _ticks: [],
                _ranges: [],
                _gauge: null,
                _caption: null,
                _animationTimeout: 10,
                renderer: null,
                _animations: [],
                aria: {
                    "aria-valuenow": {
                        name: "value",
                        type: "number"
                    },
                    "aria-valuemin": {
                        name: "min",
                        type: "number"
                    },
                    "aria-valuemax": {
                        name: "max",
                        type: "number"
                    },
                    "aria-disabled": {
                        name: "disabled",
                        type: "boolean"
                    }
                }
            };
            d.extend(true, this, e);
            return e
        },
        createInstance: function(f) {
            var e = this;
            e.that = this;
            d.jqx.aria(e);
            e._radius = e.radius;
            e.endAngle = e.endAngle * Math.PI / 180 + Math.PI / 2;
            e.startAngle = e.startAngle * Math.PI / 180 + Math.PI / 2;
            if (e.int64 === "s") {
                if (!d.jqx.longInt) {
                    throw new Error("jqxGauge: Missing reference to jqxmath.js")
                }
                d.jqx.longInt(e);
                e._value64 = new d.jqx.math().fromString(e.value.toString(), 10);
                e._min64 = new d.jqx.math().fromString(e.min.toString(), 10);
                e._max64 = new d.jqx.math().fromString(e.max.toString(), 10)
            } else {
                if (e.int64 === "u") {
                    try {
                        BigNumber
                    } catch (g) {
                        throw new Error("jqxGauge: Missing reference to jqxmath.js")
                    }
                    e._value64 = new BigNumber(e.value);
                    e._min64 = new BigNumber(e.min);
                    e._max64 = new BigNumber(e.max)
                } else {
                    e.value = new Number(e.value)
                }
            }
            e._refresh();
            e.renderer.getContainer().css("overflow", "hidden");
            if (e.int64 !== false) {
                e.setValue(e._value64, 0)
            } else {
                e.setValue(e.value, 0)
            }
            d.jqx.utilities.resize(e.host, function() {
                e._refresh(true)
            });
            e.host.addClass(e.toThemeProperty("jqx-widget"))
        },
        _validateEasing: function() {
            return !!d.easing[this.easing]
        },
        _validateProperties: function() {
            if (this.startAngle === this.endAngle) {
                throw new Error("The end angle can not be equal to the start angle!")
            }
            if (!this._validateEasing()) {
                this.easing = "linear"
            }
            this.ticksDistance = this._validatePercentage(this.ticksDistance, "20%");
            this.border = this._borderConstructor(this.border, this);
            this.style = this.style || {
                fill: "#ffffff",
                stroke: "#E0E0E0"
            };
            this.ticksMinor = new this._tickConstructor(this.ticksMinor, this);
            this.ticksMajor = new this._tickConstructor(this.ticksMajor, this);
            this.cap = new this._capConstructor(this.cap, this);
            this.pointer = new this._pointerConstructor(this.pointer, this);
            this.labels = new this._labelsConstructor(this.labels, this);
            this.caption = new this._captionConstructor(this.caption, this);
            for (var e = 0; e < this.ranges.length; e += 1) {
                this.ranges[e] = new this._rangeConstructor(this.ranges[e], this)
            }
        },
        _hostInit: function(f) {
            var e = this._getScale(this.width, "width", this.host.parent()),
                l = this._getScale(this.height, "height", this.host.parent()),
                g = this._outerBorderOffset(),
                m = this.host,
                i;
            m.width(e);
            m.height(l);
            this.radius = i = 0;
            var k = (this._getScale(this._radius, "width", this.host) || e / 2) - g;
            var j = (this._getScale(this._radius, "height", this.host) || l / 2) - g;
            this.radius = i = Math.min(k, j);
            this._originalRadius = parseInt(this.radius, 10) - this._radiusDifference;
            this._innerRadius = this._originalRadius;
            if (this.border) {
                this._innerRadius -= this._getSize(this.border.size)
            }
            if (!f) {
                m[0].innerHTML = "<div />"
            }
            this._gaugeParent = m.children();
            this._gaugeParent.width(e);
            this._gaugeParent.height(l);
            if (!f) {
                this.renderer.init(this._gaugeParent)
            } else {
                var h = this.renderer.getContainer();
                h[0].style.width = e + "px";
                h[0].style.height = l + "px"
            }
        },
        _initRenderer: function(e) {
            if (!d.jqx.createRenderer) {
                throw "Please include a reference to jqxdraw.js"
            }
            return d.jqx.createRenderer(this, e)
        },
        _refresh: function(f) {
            var e = this;
            if (f) {
                e._ticksIterator = 0;
                e._labelsIterator = 0;
                if (e._ranges) {
                    d(e._ranges).remove()
                }
                if (e._pointer) {
                    d(e._pointer).remove()
                }
                e._pointer = null;
                e._ranges = [];
                if (e.niceInterval) {
                    if (e._labels) {
                        d(e._labels).remove()
                    }
                    e._labels = [];
                    if (e._ticks) {
                        d(e._ticks).remove();
                        e._ticks = []
                    }
                }
                e._hostInit(f);
                e._render(f);
                return
            }
            if (!e.renderer) {
                e._isVML = false;
                e.host.empty();
                e._initRenderer(e.host)
            }
            var g = e.renderer;
            if (!g) {
                return
            }
            if (e._ranges) {
                d(e._ranges).remove()
            }
            if (e._pointer) {
                d(e._pointer).remove()
            }
            if (e._labels) {
                d(e._labels).remove()
            }
            if (e._cap) {
                d(e._cap).remove()
            }
            if (e._ticks) {
                d(e._ticks).remove()
            }
            if (e._border) {
                d(e._border).remove()
            }
            if (e._caption) {
                d(e._caption).remove()
            }
            e._caption = null;
            e._labels = [];
            e._cap = null;
            e._ticks = [];
            e._ranges = [];
            e._border = null;
            e._pointer = null;
            e._validateProperties();
            e._removeElements();
            e._hostInit();
            e._render();
            e.setValue(this.value, 0);
            e._editableLabels()
        },
        val: function(e) {
            if (arguments.length == 0 || typeof(e) == "object") {
                return this.value
            }
            this.setValue(e, 0)
        },
        refresh: function(e) {
            if (e === true) {
                return
            }
            this._refresh.apply(this, Array.prototype.slice(arguments))
        },
        _outerBorderOffset: function() {
            var e = parseInt(this.border.style["stroke-width"], 10) || 1;
            return e / 2
        },
        _removeCollection: function(f) {
            for (var e = 0; e < f.length; e += 1) {
                d(f[e]).remove()
            }
            f = []
        },
        _render: function(e) {
            this._addBorder(e);
            this._addGauge(e);
            this._addRanges(e);
            if (!this.niceInterval) {
                this._addTicks(e);
                this._addLabels(e)
            } else {
                this._addTicks()
            }
            this._styleLabels();
            this._addCaption(e);
            this._addPointer(e);
            this._addCap(e)
        },
        _addBorder: function(g) {
            if (!this.border.visible) {
                return
            }
            if (g) {
                var f = this._outerBorderOffset();
                this._border.setAttribute("cx", this._originalRadius + f);
                this._border.setAttribute("cy", this._originalRadius + f);
                this._border.setAttribute("r", this._originalRadius);
                return
            }
            var e = this.border.style.fill,
                f = this._outerBorderOffset();
            if (!e) {
                e = "#BABABA"
            }
            if (this.border.showGradient) {
                if (e.indexOf("url") < 0 && e.indexOf("#grd") < 0) {
                    this._originalColor = e
                } else {
                    e = this._originalColor
                }
                e = this.renderer._toLinearGradient(e, true, [
                    [0, 1],
                    [25, 1.1],
                    [50, 1.5],
                    [100, 1]
                ])
            }
            this._border = this.renderer.circle(this._originalRadius + f, this._originalRadius + f, this._originalRadius);
            this.border.style.fill = e;
            this.renderer.attr(this._border, this.border.style)
        },
        _addGauge: function(g) {
            var h = this._originalRadius,
                e = this.renderer._toLinearGradient("#ffffff", [
                    [3, 2],
                    [100, 1]
                ], true),
                f = this._outerBorderOffset();
            if (g) {
                this._gauge.setAttribute("cx", h + f);
                this._gauge.setAttribute("cy", h + f);
                this._gauge.setAttribute("r", this._innerRadius)
            } else {
                this._gauge = this.renderer.circle(h + f, h + f, this._innerRadius);
                this.renderer.attr(this._gauge, this.style)
            }
        },
        _addCap: function(h) {
            var e = "visible",
                g = this._outerBorderOffset();
            if (!this.cap.visible) {
                e = "hidden"
            }
            var i = this._originalRadius,
                f = this._getSize(this.cap.size),
                j;
            if (h) {
                this._cap.setAttribute("cx", i + g);
                this._cap.setAttribute("cy", i + g);
                this._cap.setAttribute("r", f);
                this._capCenter = [i, i]
            } else {
                j = this.renderer.circle(i + g, i + g, f);
                this._capCenter = [i, i];
                this.renderer.attr(j, this.cap.style);
                d(j).css("visibility", e);
                this._cap = j
            }
        },
        _addTicks: function(k) {
            var t = this;
            var v = this.ticksMinor,
                g = this.ticksMajor,
                p, u, r = {};
            if (g.visible === false && v.visible === false && this.labels.visible === false) {
                return
            }

            function o(i) {
                if (g.visible) {
                    t._drawTick({
                        angle: t._getAngleByValue(i),
                        distance: t._getDistance(t.ticksDistance),
                        style: g.style,
                        size: t._getSize(g.size),
                        type: "major"
                    }, k)
                }
            }

            function h(j) {
                if (v.visible) {
                    t._drawTick({
                        angle: t._getAngleByValue(j),
                        distance: t._getDistance(t.ticksDistance),
                        style: v.style,
                        size: t._getSize(v.size),
                        type: "minor"
                    }, k)
                }
            }

            function e(i) {
                if (t.labels.visible) {
                    t._addLabel({
                        angle: t._getAngleByValue(i),
                        value: u >= 1 ? i : new Number(i).toFixed(2),
                        distance: t._getDistance(t._getLabelsDistance()),
                        style: t.labels.className
                    }, k)
                }
            }
            var n = 0;
            if (t.int64 === "s") {
                if (this.tickMode === "default") {
                    if (this.niceInterval) {
                        u = this._getNiceInterval("radial");
                        p = this._getNiceInterval("radial", true)
                    } else {
                        u = new d.jqx.math().fromString((g.interval).toString(), 10);
                        p = new d.jqx.math().fromString((v.interval).toString(), 10)
                    }
                } else {
                    startToEnd = this._max64.subtract(this._min64);
                    p = startToEnd.div(new d.jqx.math().fromString((v.number).toString(), 10));
                    u = startToEnd.div(new d.jqx.math().fromString((g.number).toString(), 10))
                }
                if (this.niceInterval) {
                    o(this._min64);
                    e(this._min64);
                    var f = this._min64.subtract(this._min64.modulo(u)).add(u),
                        s;
                    for (var q = f; q.greaterThanOrEqual(this._min64); q = q.subtract(p)) {
                        s = q
                    }
                    for (var m = s, l = f; m.lessThan(this._max64) || l.lessThan(this._max64); m = m.add(p), l = l.add(u)) {
                        n += 1;
                        if (n > 250) {
                            break
                        }
                        if (l.lessThanOrEqual(this._max64)) {
                            o(l);
                            r[l.toString()] = true;
                            if (m.equals(f)) {
                                if (Math.abs(this._getAngleByValue(l) - this._getAngleByValue(this.min)) * this._innerRadius > this._getMaxLabelSize()["height"]) {
                                    e(l)
                                }
                            } else {
                                if ((l.add(u)).lessThan(this._max64)) {
                                    e(l)
                                } else {
                                    if (Math.abs(this._getAngleByValue(l) - this._getAngleByValue(this.max)) * this._innerRadius > this._getMaxLabelSize()["height"]) {
                                        e(l)
                                    }
                                }
                            }
                        }
                        if (!r[m.toString()] && m.lessThanOrEqual(t._max64)) {
                            h(m)
                        }
                        if (t._checkForOverflow(m, p) || t._checkForOverflow(l, u)) {
                            break
                        }
                    }
                    o(this._max64);
                    e(this._max64)
                } else {
                    for (var m = new d.jqx.math().fromString((t.min).toString(), 10), l = new d.jqx.math().fromString((t.min).toString(), 10); m.lessThanOrEqual(t._max64) || l.lessThanOrEqual(t._max64); m = m.add(p), l = l.add(u)) {
                        n += 1;
                        if (n > 250) {
                            break
                        }
                        if (l.lessThanOrEqual(t._max64) && g.visible) {
                            o(l);
                            r[l.toString()] = true
                        }
                        if (!r[m.toString()] && v.visible && m.lessThanOrEqual(t._max64)) {
                            h(m)
                        }
                    }
                }
            } else {
                if (t.int64 === "u") {
                    if (this.tickMode === "default") {
                        if (this.niceInterval) {
                            u = this._getNiceInterval("radial");
                            p = this._getNiceInterval("radial", true)
                        } else {
                            u = new BigNumber(g.interval);
                            p = new BigNumber(v.interval)
                        }
                    } else {
                        startToEnd = this._max64.subtract(this._min64);
                        p = startToEnd.divide(new BigNumber(v.number));
                        u = startToEnd.divide(new BigNumber(g.number))
                    }
                    if (this.niceInterval) {
                        o(this._min64);
                        e(this._min64);
                        var f = this._min64.subtract(this._min64.mod(u)).add(u),
                            s;
                        for (var q = f; q.compare(this._min64) !== -1; q = q.subtract(p)) {
                            s = q
                        }
                        for (var m = s, l = f; m.compare(this._max64) === -1 || l.compare(this._max64) === -1; m = m.add(p), l = l.add(u)) {
                            n += 1;
                            if (n > 250) {
                                break
                            }
                            if (l.compare(this._max64) !== 1) {
                                o(l);
                                r[l.toString()] = true;
                                if (m.compare(f) === 0) {
                                    if (Math.abs(this._getAngleByValue(l) - this._getAngleByValue(this.min)) * this._innerRadius > this._getMaxLabelSize()["height"]) {
                                        e(l)
                                    }
                                } else {
                                    if ((l.add(u)).compare(this._max64) === -1) {
                                        e(l)
                                    } else {
                                        if (Math.abs(this._getAngleByValue(l) - this._getAngleByValue(this.max)) * this._innerRadius > this._getMaxLabelSize()["height"]) {
                                            e(l)
                                        }
                                    }
                                }
                            }
                            if (!r[m.toString()] && (m.compare(t._max64) !== 1)) {
                                h(m)
                            }
                        }
                        o(this._max64);
                        e(this._max64)
                    } else {
                        for (var m = new BigNumber(t.min), l = new BigNumber(t.min);
                            (m.compare(t._max64) !== 1) || (l.compare(t._max64) !== 1); m = m.add(p), l = l.add(u)) {
                            n += 1;
                            if (n > 250) {
                                break
                            }
                            if ((l.compare(t._max64) !== 1) && g.visible) {
                                o(l);
                                r[l.toString()] = true
                            }
                            if (!r[m.toString()] && v.visible && (m.compare(t._max64) !== 1)) {
                                h(m)
                            }
                        }
                    }
                } else {
                    if (this.tickMode === "default") {
                        if (this.niceInterval) {
                            u = this._getNiceInterval("radial");
                            p = this._getNiceInterval("radial", true)
                        } else {
                            u = g.interval;
                            p = v.interval
                        }
                    } else {
                        startToEnd = this.max - this.min;
                        p = startToEnd / v.number;
                        u = startToEnd / g.number
                    }
                    if (this.niceInterval) {
                        o(this.min);
                        e(this.min);
                        var f = this.min - (this.min % u) + u,
                            s;
                        for (var q = f; q >= this.min; q = q - p) {
                            s = q
                        }
                        for (var m = s, l = f; m < this.max || l < this.max; m += p, l += u) {
                            n += 1;
                            if (n > 250) {
                                break
                            }
                            if (l <= this.max) {
                                o(l);
                                r[l.toFixed(5)] = true;
                                if (m === f) {
                                    if (Math.abs(this._getAngleByValue(l) - this._getAngleByValue(this.min)) * this._innerRadius > this._getMaxLabelSize()["height"]) {
                                        e(l)
                                    }
                                } else {
                                    if (l + u < this.max) {
                                        e(l)
                                    } else {
                                        if (Math.abs(this._getAngleByValue(l) - this._getAngleByValue(this.max)) * this._innerRadius > this._getMaxLabelSize()["height"]) {
                                            e(l)
                                        }
                                    }
                                }
                            }
                            if (!r[m.toFixed(5)] && m <= this.max) {
                                h(m)
                            }
                        }
                        o(this.max);
                        e(this.max)
                    } else {
                        for (var m = this.min, l = this.min; m <= this.max || l <= this.max; m += p, l += u) {
                            n += 1;
                            if (n > 250) {
                                break
                            }
                            if (l <= this.max && g.visible) {
                                o(l);
                                r[l.toFixed(5)] = true
                            }
                            if (!r[m.toFixed(5)] && v.visible && m <= this.max) {
                                h(m)
                            }
                        }
                    }
                }
            }
            this._handleTicksVisibility()
        },
        _handleTicksVisibility: function() {
            if (!this.ticksMinor.visible) {
                this.host.children(".jqx-gauge-tick-minor").css("visibility", "hidden")
            } else {
                this.host.children(".jqx-gauge-tick-minor").css("visibility", "visible")
            }
            if (!this.ticksMajor.visible) {
                this.host.children(".jqx-gauge-tick-major").css("visibility", "hidden")
            } else {
                this.host.children(".jqx-gauge-tick-major").css("visibility", "visible")
            }
        },
        _getSize: function(e) {
            if (e.toString().indexOf("%") >= 0) {
                e = (parseInt(e, 10) / 100) * this._innerRadius
            }
            e = parseInt(e, 10);
            return e
        },
        _getDistance: function(e) {
            return this._getSize(e) + (this._originalRadius - this._innerRadius)
        },
        _drawTick: function(t, k) {
            var m = this.that;
            var j = t.angle,
                g = t.distance,
                s = t.size,
                l = m._outerBorderOffset(),
                e = m._originalRadius,
                i = e - g,
                n = i - s,
                h = e + l + i * Math.sin(j),
                p = e + l + i * Math.cos(j),
                f = e + l + n * Math.sin(j),
                o = e + l + n * Math.cos(j),
                q;
            t.style["class"] = m.toThemeProperty("jqx-gauge-tick-" + t.type);
            if (m._isVML) {
                h = Math.round(h);
                f = Math.round(f);
                p = Math.round(p);
                o = Math.round(o)
            }
            if (k && !m.niceInterval) {
                var q = m._ticks[m._ticksIterator];
                q.setAttribute("x1", h);
                q.setAttribute("x2", f);
                q.setAttribute("y1", p);
                q.setAttribute("y2", o);
                m._ticksIterator++
            } else {
                q = m.renderer.line(h, p, f, o, t.style);
                m._ticks.push(q)
            }
        },
        _addRanges: function(h) {
            var f = "visible";
            if (!this.showRanges) {
                f = "hidden"
            } else {
                var e = this.ranges;
                for (var g = 0; g < e.length; g += 1) {
                    this._addRange(e[g], f, h)
                }
            }
        },
        _getMaxRangeSize: function() {
            var f, h = -1,
                j, e;
            for (var g = 0; g < this.ranges.length; g += 1) {
                j = this.ranges[g].startWidth;
                e = this.ranges[g].endWidth;
                if (j > h) {
                    h = j
                }
                if (e > h) {
                    h = e
                }
            }
            return h
        },
        _getRangeDistance: function(i, e) {
            var h = this._getLabelsDistance(),
                f = this._getDistance(i),
                g = this._getMaxRangeSize();
            if (this.labels.position === "outside") {
                if (h < f + this._getMaxTickSize()) {
                    return this._getDistance(this.ticksDistance) + g / 2 + this._getSize(this.ticksMajor.size)
                }
            } else {
                if (this.labels.position === "inside") {
                    if (h + this._getMaxTickSize() < f) {
                        return this._getSize(this.border.size) + this._originalRadius / 20
                    }
                }
            }
            return f
        },
        _addRange: function(m, u, i) {
            var h = this.that;
            if ((h.int64 === "s" && (m._startValue64.lessThan(h._min64) || m._endValue64.greaterThan(h._max64))) || (h.int64 === "u" && ((m._startValue64.compare(h._min64) === -1) || (m._endValue64.compare(h._max64) === 1))) || (h.int64 === false && (m.startValue < h.min || m.endValue > h.max))) {
                return
            }
            var s = h.int64 ? h._getAngleByValue(m._startValue64) : h._getAngleByValue(m.startValue),
                q = h.int64 ? h._getAngleByValue(m._endValue64) : h._getAngleByValue(m.endValue);
            var f = h._originalRadius,
                r = f - h._getRangeDistance(m.startDistance, m.startWidth),
                t = f - h._getRangeDistance(m.endDistance, m.endWidth),
                n = m.startWidth,
                k = m.endWidth,
                j = h._outerBorderOffset(),
                p = {
                    x: f + j + r * Math.sin(s),
                    y: f + j + r * Math.cos(s)
                },
                l = {
                    x: f + j + t * Math.sin(q),
                    y: f + j + t * Math.cos(q)
                },
                v = h._getProjectionPoint(s, f + j, r, n),
                g = h._getProjectionPoint(q, f + j, t, k),
                e = "default",
                o, m;
            if (Math.abs(q - s) > Math.PI) {
                e = "opposite"
            }
            if (h._isVML) {
                o = h._rangeVMLRender(p, l, f, v, g, k, n, r, t, e)
            } else {
                o = h._rangeSVGRender(p, l, f, v, g, k, n, r, t, e)
            }
            m.style.visibility = u;
            m.style["class"] = h.toThemeProperty("jqx-gauge-range");
            m = h.renderer.path(o, m.style);
            h._ranges.push(m)
        },
        _rangeSVGRender: function(i, m, k, o, l, e, j, f, n, h) {
            var p = "",
                f = k - f,
                n = k - n,
                g = ["0,1", "0,0"];
            if (h === "opposite") {
                g = ["1,1", "1,0"]
            }
            p = "M" + i.x + "," + i.y + " ";
            p += "A" + (k - f) + "," + (k - f) + " 100 " + g[0] + " " + m.x + "," + m.y + " ";
            p += "L " + (l.x) + "," + (l.y) + " ";
            p += "A" + (k - e - f) + "," + (k - e - f) + " 100 " + g[1] + " " + (o.x) + "," + (o.y) + " ";
            p += "L " + (i.x) + "," + (i.y) + " ";
            p += "z";
            return p
        },
        _rangeVMLRender: function(p, m, h, w, i, l, n, q, s, f) {
            h -= h - q + 10;
            var o = "",
                r = Math.floor(h + (n + l) / 2),
                q = Math.floor(h - q),
                s = Math.floor(s),
                t = {
                    x: (w.x + i.x) / 2,
                    y: (w.y + i.y) / 2
                },
                e = Math.sqrt((i.x - w.x) * (i.x - w.x) + (i.y - w.y) * (i.y - w.y)),
                v = Math.floor(t.x + Math.sqrt(h * h - (e / 2) * (e / 2)) * (w.y - i.y) / e),
                u = Math.floor(t.y + Math.sqrt(h * h - (e / 2) * (e / 2)) * (i.x - w.x) / e),
                x = {
                    x: (p.x + m.x) / 2,
                    y: (p.y + m.y) / 2
                },
                g = Math.sqrt((m.x - p.x) * (m.x - p.x) + (m.y - p.y) * (m.y - p.y)),
                k = Math.floor(x.x + Math.sqrt(Math.abs(r * r - (g / 2) * (g / 2))) * (p.y - m.y) / g),
                j = Math.floor(x.y + Math.sqrt(Math.abs(r * r - (g / 2) * (g / 2))) * (m.x - p.x) / g);
            if (f === "opposite") {
                v = Math.floor(t.x - Math.sqrt(h * h - (e / 2) * (e / 2)) * (w.y - i.y) / e);
                u = Math.floor(t.y - Math.sqrt(h * h - (e / 2) * (e / 2)) * (i.x - w.x) / e);
                k = Math.floor(x.x - Math.sqrt(Math.abs(r * r - (g / 2) * (g / 2))) * (p.y - m.y) / g);
                j = Math.floor(x.y - Math.sqrt(Math.abs(r * r - (g / 2) * (g / 2))) * (m.x - p.x) / g)
            }
            h = Math.floor(h);
            m = {
                x: Math.floor(m.x),
                y: Math.floor(m.y)
            };
            p = {
                x: Math.floor(p.x),
                y: Math.floor(p.y)
            };
            w = {
                x: Math.floor(w.x),
                y: Math.floor(w.y)
            };
            i = {
                x: Math.floor(i.x),
                y: Math.floor(i.y)
            };
            o = "m " + m.x + "," + m.y;
            o += "at " + (k - r) + " " + (j - r) + " " + (r + k) + " " + (r + j) + " " + m.x + "," + m.y + " " + p.x + "," + p.y;
            o += "l " + w.x + "," + w.y;
            o += "m " + m.x + "," + m.y;
            o += "l " + i.x + "," + i.y;
            o += "at " + (v - h) + " " + (u - h) + " " + (h + v) + " " + (h + u) + " " + i.x + "," + i.y + " " + w.x + "," + w.y;
            o += "qx " + w.x + " " + w.y;
            return o
        },
        _getProjectionPoint: function(i, f, h, g) {
            var e = {
                x: f + (h - g) * Math.sin(i),
                y: f + (h - g) * Math.cos(i)
            };
            return e
        },
        _addLabels: function(i) {
            var g = this,
                f = g._getLabelInterval();
            if (g.labels.visible && g.labels.interval.toString() !== "0") {
                var k = this._getDistance(this._getLabelsDistance()),
                    j;
                var h = 0;
                if (g.int64 === "s") {
                    for (var e = new d.jqx.math().fromNumber(g.min.toString(), 10); e.lessThanOrEqual(g._max64); e = e.add(f)) {
                        h += 1;
                        if (h > 250) {
                            break
                        }
                        if (e.lessThan(g._min64) || e.greaterThan(g._max64)) {
                            break
                        }
                        this._addLabel({
                            angle: this._getAngleByValue(e),
                            value: e.toString(),
                            distance: k,
                            style: this.labels.className
                        })
                    }
                } else {
                    if (g.int64 === "u") {
                        for (var e = new BigNumber(g.min); e.compare(g._max64) !== 1; e = e.add(f)) {
                            h += 1;
                            if (h > 250) {
                                break
                            }
                            if ((e.compare(g._min64) === -1) || (e.compare(g._max64) === 1)) {
                                break
                            }
                            this._addLabel({
                                angle: this._getAngleByValue(e),
                                value: e.toString(),
                                distance: k,
                                style: this.labels.className
                            })
                        }
                    } else {
                        for (var e = this.min; e <= this.max; e += f) {
                            h += 1;
                            if (h > 250) {
                                break
                            }
                            this._addLabel({
                                angle: this._getAngleByValue(e),
                                value: f >= 1 ? e : new Number(e).toFixed(2),
                                distance: k,
                                style: this.labels.className
                            }, i)
                        }
                    }
                }
            }
        },
        _getLabelsDistance: function() {
            var g = this._getMaxLabelSize(),
                f = this._getDistance(this.labels.distance),
                e = this._getDistance(this.ticksDistance);
            g = g.width;
            if (this.labels.position === "inside") {
                return e + g - 5
            } else {
                if (this.labels.position === "outside") {
                    if (f < (e - g * 1.5)) {
                        return f
                    }
                    return Math.max(e - g * 1.5, 0.6 * g)
                }
            }
            return this.labels.distance
        },
        _addLabel: function(k, p) {
            var n = this.that;
            var C = k.angle,
                z = n._originalRadius,
                t = z - k.distance,
                m = n.labels.offset,
                u = n._outerBorderOffset(),
                s = z + u + t * Math.sin(C) + m[0],
                q = z + u + t * Math.cos(C) + m[1],
                B = k.value,
                f = k.style || "",
                A, o, h = n.labels.fontSize;
            B = n._formatLabel(B.toString());
            var i = {
                "class": f
            };
            if (h) {
                i["font-size"] = h
            }
            if (n.labels.fontFamily) {
                i["font-family"] = n.labels.fontFamily
            }
            if (n.labels.fontWeight) {
                i["font-weight"] = n.labels.fontWeight
            }
            if (n.labels.fontStyle) {
                i["font-style"] = n.labels.fontStyle
            }
            if (p && !n.niceInterval) {
                var o = n._labels[n._labelsIterator];
                var v = n.renderer._measureText(B, 0, i, true);
                var j = v.textPartsInfo;
                var g = j.parts;
                var D = j.width;
                var l = j.height;
                o.setAttribute("x", Math.round(s) - v.width / 2 + (v.width - j.width) / 2);
                o.setAttribute("y", Math.round(q) + l + (v.height - l) / 2);
                n._labelsIterator++
            } else {
                var A = n.renderer.measureText(B, 0, i);
                var e = 0;
                if (h !== undefined && Math.PI > C) {
                    e = (-A.width / 2) * (parseInt(h) / 25);
                    if (parseInt(h) <= 10) {
                        e *= -1
                    }
                }
                o = n.renderer.text(B, Math.round(s) - A.width / 2 + e, Math.round(q), A.width, A.height, 0, i);
                n._labels.push(o)
            }
        },
        _addCaption: function(g) {
            if (this.caption.visible !== false) {
                var j = this.that;
                var l = j.caption.value,
                    k = j.toThemeProperty("jqx-gauge-caption"),
                    h = j.caption.offset,
                    n = j.renderer.measureText(l, 0, {
                        "class": k
                    }),
                    i = j._getPosition(this.caption.position, n, h),
                    e = j.caption.style,
                    f = j._outerBorderOffset();
                if (!g) {
                    var m = j.renderer.text(l, i.left + f, i.top + f, n.width, n.height, 0, {
                        "class": k
                    });
                    this._caption = m
                } else {
                    this._caption.setAttribute("x", i.left + f);
                    this._caption.setAttribute("y", i.top + f)
                }
            }
        },
        _getPosition: function(e, f, j) {
            var i = 0,
                h = 0,
                g = this._originalRadius;
            switch (e) {
                case "left":
                    i = (g - f.width) / 2;
                    h = g - f.height / 2;
                    break;
                case "right":
                    i = g + (g - f.width) / 2;
                    h = g - f.height / 2;
                    break;
                case "bottom":
                    i = (2 * g - f.width) / 2;
                    h = (g + 2 * g - f.height) / 2;
                    break;
                default:
                    i = (2 * g - f.width) / 2;
                    h = (g + f.height) / 2;
                    break
            }
            return {
                left: i + j[0],
                top: h + j[1]
            }
        },
        _addPointer: function(i) {
            var g = "visible";
            if (!this.pointer.visible) {
                g = "hidden"
            }
            var f = this._originalRadius,
                j = this._getSize(this.pointer.length),
                k = j * 0.9,
                l = this._getAngleByValue(this.value),
                e = this.pointer.pointerType,
                h;
            h = this._computePointerPoints(this._getSize(this.pointer.width), l, j, e !== "default");
            this._pointer = this.renderer.path(h, this.pointer.style);
            d(this._pointer).css("visibility", g)
        },
        _computePointerPoints: function(e, g, h, f) {
            if (!f) {
                return this._computeArrowPoints(e, g, h)
            } else {
                return this._computeRectPoints(e, g, h)
            }
        },
        _computeArrowPoints: function(n, g, k) {
            var f = this._originalRadius - 0.5,
                l = Math.sin(g),
                q = Math.cos(g),
                j = this._outerBorderOffset(),
                o = f + j + k * l,
                m = f + j + k * q,
                i = f + j + n * q,
                e = f + j - n * l,
                h = f + j - n * q,
                s = f + j + n * l,
                p;
            if (this._isVML) {
                i = Math.round(i);
                h = Math.round(h);
                e = Math.round(e);
                s = Math.round(s);
                o = Math.round(o);
                m = Math.round(m)
            }
            p = "M " + i + "," + e + " L " + h + "," + s + " L " + o + "," + m + "";
            return p
        },
        _computeRectPoints: function(q, i, o) {
            var f = this._originalRadius,
                p = Math.sin(i),
                t = Math.cos(i),
                u = o,
                l = this._outerBorderOffset(),
                n = f + l - q * t + o * p,
                h = f + l + q * p + o * t,
                m = f + l + q * t + o * p,
                g = f + l - q * p + o * t,
                k = f + l + q * t,
                e = f + l - q * p,
                j = f + l - q * t,
                v = f + l + q * p,
                s;
            if (this._isVML) {
                k = Math.round(k);
                j = Math.round(j);
                e = Math.round(e);
                v = Math.round(v);
                n = Math.round(n);
                h = Math.round(h);
                m = Math.round(m);
                g = Math.round(g)
            }
            s = "M " + k + "," + e + " L " + j + "," + v + " L " + n + "," + h + " " + m + "," + g;
            return s
        },
        _getAngleByValue: function(s) {
            var v = this,
                p = v.startAngle,
                t = p - v.endAngle,
                e, k, o, n, h;
            if (v.int64 !== false) {
                if (v.int64 === "s") {
                    s = new d.jqx.math().fromString(s.toString(), 10)
                } else {
                    s = new BigNumber(s)
                }
                e = v._min64;
                k = v._max64;
                o = k.subtract(e);
                n = s.subtract(e);
                if (v.int64 === "u") {
                    n = n.intPart()
                }
                var f = o.toString(),
                    j, r = n.toString(),
                    g;
                if (f.length > 15) {
                    var u = f.length - 15;
                    f = f.slice(0, 15) + "." + f.slice(15);
                    j = parseFloat(f);
                    if (r.length > u) {
                        var q = r.length - u;
                        r = r.slice(0, q) + "." + r.slice(q)
                    } else {
                        if (r.length === u) {
                            r = "0." + r
                        } else {
                            var m = "0.";
                            for (var l = 0; l < u - r.length; l++) {
                                m += "0"
                            }
                            r = m + "" + r
                        }
                    }
                    g = parseFloat(r)
                } else {
                    j = parseFloat(o.toString());
                    g = parseFloat(n.toString())
                }
                h = t * g / j + p + Math.PI
            } else {
                e = v.min;
                k = v.max;
                o = k - e;
                n = s - e;
                h = t * n / o + p + Math.PI
            }
            return h
        },
        _setValue: function(h) {
            var f = this;
            if ((f.int64 === "s" && h.lessThanOrEqual(f._max64) && h.greaterThanOrEqual(f._min64)) || (f.int64 === "u" && h.compare(f._max64) !== 1 && h.compare(f._min64) !== -1) || (f.int64 === false && h <= f.max && h >= f.min)) {
                var i = f._getAngleByValue(h),
                    e = f.pointer.pointerType,
                    g = f._computePointerPoints(f._getSize(f.pointer.width), i, f._getSize(f.pointer.length), e !== "default");
                if (f._isVML) {
                    if (f._pointer) {
                        d(f._pointer).remove()
                    }
                    f._pointer = f.renderer.path(g, f.pointer.style)
                } else {
                    f.renderer.attr(f._pointer, {
                        d: g
                    })
                }
                if (f.int64 !== false) {
                    f.value = h.toString();
                    if (f.int64 === "s") {
                        f._value64 = new d.jqx.math().fromString(f.value, 10)
                    } else {
                        f._value64 = new BigNumber(f.value)
                    }
                } else {
                    f.value = h
                }
                d.jqx.aria(f, "aria-valuenow", h.toString())
            }
        },
        resize: function(f, e) {
            this.width = f;
            this.height = e;
            this.refresh()
        },
        propertiesChangedHandler: function(e, f, g) {
            if (g.width && g.height && Object.keys(g).length == 2) {
                e._refresh(true)
            }
        },
        propertyChangedHandler: function(e, f, h, g) {
            if (g == h) {
                return
            }
            if (e.batchUpdate && e.batchUpdate.width && e.batchUpdate.height && Object.keys(e.batchUpdate).length == 2) {
                return
            }
            if (f == "min") {
                if (e.int64 === true) {
                    e._min64 = new d.jqx.math().fromString(g.toString(), 10)
                } else {
                    this.min = parseInt(g)
                }
                d.jqx.aria(e, "aria-valuemin", g)
            }
            if (f == "max") {
                if (e.int64 === true) {
                    e._max64 = new d.jqx.math().fromString(g.toString(), 10)
                } else {
                    this.max = parseInt(g)
                }
                d.jqx.aria(e, "aria-valuemax", g)
            }
            if (f === "disabled") {
                if (g) {
                    this.disable()
                } else {
                    this.enable()
                }
                d.jqx.aria(this, "aria-disabled", g)
            } else {
                if (f === "value") {
                    this.value = h;
                    this.setValue(g)
                } else {
                    if (f === "startAngle") {
                        this.startAngle = this.startAngle * Math.PI / 180 + Math.PI / 2
                    } else {
                        if (f === "endAngle") {
                            this.endAngle = this.endAngle * Math.PI / 180 + Math.PI / 2
                        } else {
                            if (f === "colorScheme") {
                                this.pointer.style = null;
                                this.cap.style = null
                            } else {
                                if (f === "radius") {
                                    this._radius = g
                                }
                            }
                        }
                    }
                    if (f !== "animationDuration" && f !== "easing") {
                        this._refresh()
                    }
                }
            }
            if (this.renderer instanceof d.jqx.HTML5Renderer) {
                this.renderer.refresh()
            }
        },
        _tickConstructor: function(g, e) {
            if (this.host) {
                return new this._tickConstructor(g, e)
            }
            g = g || {};
            this.size = e._validatePercentage(g.size, "10%");

            function f(h, i) {
                if (e.int64 === false) {
                    h[i] = parseFloat(g[i])
                } else {
                    h[i] = g[i]
                }
                if (!h[i]) {
                    h[i] = 5
                }
            }
            f(this, "interval");
            f(this, "number");
            this.style = g.style || {
                stroke: "#898989",
                "stroke-width": 1
            };
            if (typeof g.visible === "undefined") {
                this.visible = true
            } else {
                this.visible = g.visible
            }
        },
        _capConstructor: function(g, e) {
            var f = e._getColorScheme(e.colorScheme)[0];
            if (this.host) {
                return new this._capConstructor(g, e)
            }
            g = g || {};
            if (typeof g.visible === "undefined") {
                this.visible = true
            } else {
                this.visible = g.visible
            }
            this.size = e._validatePercentage(g.size, "4%");
            this.style = g.style || {
                fill: f,
                "stroke-width": "1px",
                stroke: f,
                "z-index": 30
            }
        },
        _pointerConstructor: function(g, e) {
            var f = e._getColorScheme(e.colorScheme)[0];
            if (this.host) {
                return new this._pointerConstructor(g, e)
            }
            g = g || {};
            if (typeof g.visible === "undefined") {
                this.visible = true
            } else {
                this.visible = g.visible
            }
            this.pointerType = g.pointerType;
            if (this.pointerType !== "default" && this.pointerType !== "rectangle") {
                this.pointerType = "default"
            }
            this.style = g.style || {
                "z-index": 0,
                stroke: f,
                fill: f,
                "stroke-width": 1
            };
            this.length = e._validatePercentage(g.length, "70%");
            this.width = e._validatePercentage(g.width, "2%")
        },
        _labelsConstructor: function(f, e) {
            if (this.host) {
                return new this._labelsConstructor(f, e)
            }
            f = f || {};
            if (typeof f.visible === "undefined") {
                this.visible = true
            } else {
                this.visible = f.visible
            }
            this.offset = f.offset;
            if (!(this.offset instanceof Array)) {
                this.offset = [0, -10]
            }
            if (!f.interval) {
                f.interval = 20
            }
            if (e.int64 !== false) {
                this.interval = f.interval;
                if (e.int64 === "s") {
                    this._interval64 = new d.jqx.math().fromString(f.interval.toString(), 10)
                } else {
                    this._interval64 = new BigNumber(f.interval)
                }
            } else {
                this.interval = parseFloat(f.interval)
            }
            if (!f.number) {
                f.number = 5
            }
            this.number = f.number;
            this.distance = e._validatePercentage(f.distance, "38%");
            this.position = f.position;
            if (this.position !== "inside" && this.position !== "outside") {
                this.position = "none"
            }
            this.formatValue = f.formatValue;
            this.formatSettings = f.formatSettings;
            this.fontSize = f.fontSize;
            this.fontFamily = f.fontFamily;
            this.fontWeight = f.fontWeight;
            this.fontStyle = f.fontStyle
        },
        _captionConstructor: function(f, e) {
            if (this.host) {
                return new this._captionConstructor(f, e)
            }
            f = f || {};
            if (typeof f.visible === "undefined") {
                this.visible = true
            } else {
                this.visible = f.visible
            }
            this.value = f.value || "";
            this.position = f.position;
            if (this.position !== "bottom" && this.position !== "top" && this.position !== "left" && this.position !== "right") {
                this.position = "bottom"
            }
            this.offset = f.offset;
            if (!(this.offset instanceof Array)) {
                this.offset = [0, 0]
            }
        },
        _rangeConstructor: function(f, e) {
            if (this.host) {
                return new this._rangeConstructor(f, e)
            }
            f = f || {};
            this.startDistance = e._validatePercentage(f.startDistance, "5%");
            this.endDistance = e._validatePercentage(f.endDistance, "5%");
            this.style = f.style || {
                fill: "#000000",
                stroke: "#111111"
            };
            this.startWidth = parseFloat(f.startWidth, 10);
            if (!this.startWidth) {
                this.startWidth = 10
            }
            this.startWidth = Math.max(this.startWidth, 2);
            this.endWidth = parseFloat(f.endWidth, 10);
            if (!this.endWidth) {
                this.endWidth = 10
            }
            this.endWidth = Math.max(this.endWidth, 2);
            if (f.startValue === undefined) {
                f.startValue = 0
            }
            if (f.endValue === undefined) {
                f.endValue = 100
            }
            if (e.int64 !== false) {
                this.startValue = f.startValue;
                this.endValue = f.endValue;
                if (e.int64 === "s") {
                    this._startValue64 = new d.jqx.math().fromString(f.startValue.toString(), 10);
                    this._endValue64 = new d.jqx.math().fromString(f.endValue.toString(), 10)
                } else {
                    this._startValue64 = new BigNumber(f.startValue);
                    this._endValue64 = new BigNumber(f.endValue)
                }
            } else {
                this.startValue = parseFloat(f.startValue, 10);
                this.endValue = parseFloat(f.endValue, 10)
            }
        },
        _borderConstructor: function(f, e) {
            if (this.host) {
                return new this._borderConstructor(f, e)
            }
            f = f || {};
            this.size = e._validatePercentage(f.size, "10%");
            this.style = f.style || {
                stroke: "#cccccc"
            };
            if (typeof f.showGradient === "undefined") {
                this.showGradient = true
            } else {
                this.showGradient = f.showGradient
            }
            if (typeof f.visible === "undefined") {
                this.visible = true
            } else {
                this.visible = f.visible
            }
        }
    };
    var c = {
            _events: ["valueChanging", "valueChanged"],
            _animationTimeout: 10,
            _schemes: [{
                name: "scheme01",
                colors: ["#307DD7", "#AA4643", "#89A54E", "#71588F", "#4198AF"]
            }, {
                name: "scheme02",
                colors: ["#7FD13B", "#EA157A", "#FEB80A", "#00ADDC", "#738AC8"]
            }, {
                name: "scheme03",
                colors: ["#E8601A", "#FF9639", "#F5BD6A", "#599994", "#115D6E"]
            }, {
                name: "scheme04",
                colors: ["#D02841", "#FF7C41", "#FFC051", "#5B5F4D", "#364651"]
            }, {
                name: "scheme05",
                colors: ["#25A0DA", "#309B46", "#8EBC00", "#FF7515", "#FFAE00"]
            }, {
                name: "scheme06",
                colors: ["#0A3A4A", "#196674", "#33A6B2", "#9AC836", "#D0E64B"]
            }, {
                name: "scheme07",
                colors: ["#CC6B32", "#FFAB48", "#FFE7AD", "#A7C9AE", "#888A63"]
            }, {
                name: "scheme08",
                colors: ["#3F3943", "#01A2A6", "#29D9C2", "#BDF271", "#FFFFA6"]
            }, {
                name: "scheme09",
                colors: ["#1B2B32", "#37646F", "#A3ABAF", "#E1E7E8", "#B22E2F"]
            }, {
                name: "scheme10",
                colors: ["#5A4B53", "#9C3C58", "#DE2B5B", "#D86A41", "#D2A825"]
            }, {
                name: "scheme11",
                colors: ["#993144", "#FFA257", "#CCA56A", "#ADA072", "#949681"]
            }, {
                name: "scheme12",
                colors: ["#105B63", "#EEEAC5", "#FFD34E", "#DB9E36", "#BD4932"]
            }, {
                name: "scheme13",
                colors: ["#BBEBBC", "#F0EE94", "#F5C465", "#FA7642", "#FF1E54"]
            }, {
                name: "scheme14",
                colors: ["#60573E", "#F2EEAC", "#BFA575", "#A63841", "#BFB8A3"]
            }, {
                name: "scheme15",
                colors: ["#444546", "#FFBB6E", "#F28D00", "#D94F00", "#7F203B"]
            }, {
                name: "scheme16",
                colors: ["#583C39", "#674E49", "#948658", "#F0E99A", "#564E49"]
            }, {
                name: "scheme17",
                colors: ["#142D58", "#447F6E", "#E1B65B", "#C8782A", "#9E3E17"]
            }, {
                name: "scheme18",
                colors: ["#4D2B1F", "#635D61", "#7992A2", "#97BFD5", "#BFDCF5"]
            }, {
                name: "scheme19",
                colors: ["#844341", "#D5CC92", "#BBA146", "#897B26", "#55591C"]
            }, {
                name: "scheme20",
                colors: ["#56626B", "#6C9380", "#C0CA55", "#F07C6C", "#AD5472"]
            }, {
                name: "scheme21",
                colors: ["#96003A", "#FF7347", "#FFBC7B", "#FF4154", "#642223"]
            }, {
                name: "scheme22",
                colors: ["#5D7359", "#E0D697", "#D6AA5C", "#8C5430", "#661C0E"]
            }, {
                name: "scheme23",
                colors: ["#16193B", "#35478C", "#4E7AC7", "#7FB2F0", "#ADD5F7"]
            }, {
                name: "scheme24",
                colors: ["#7B1A25", "#BF5322", "#9DA860", "#CEA457", "#B67818"]
            }, {
                name: "scheme25",
                colors: ["#0081DA", "#3AAFFF", "#99C900", "#FFEB3D", "#309B46"]
            }, {
                name: "scheme26",
                colors: ["#0069A5", "#0098EE", "#7BD2F6", "#FFB800", "#FF6800"]
            }, {
                name: "scheme27",
                colors: ["#FF6800", "#A0A700", "#FF8D00", "#678900", "#0069A5"]
            }],
            _getScale: function(e, g, f) {
                if (e && e.toString().indexOf("%") >= 0) {
                    e = parseInt(e, 10) / 100;
                    return f[g]() * e
                }
                return parseInt(e, 10)
            },
            _removeElements: function() {
                this.host.children(".chartContainer").remove();
                this.host.children("#tblChart").remove()
            },
            _getLabelInterval: function() {
                var g = this,
                    h = g.labels,
                    e;
                if (g.tickMode === "default") {
                    if (g.niceInterval) {
                        e = g._getNiceInterval(g.widgetName === "jqxGauge" ? "radial" : "linear")
                    } else {
                        if (g.int64 === false) {
                            e = h.interval
                        } else {
                            if (!h._interval64) {
                                h._interval64 = g.int64 === "s" ? new d.jqx.math().fromNumber(h.interval) : new BigNumber(h.interval)
                            }
                            e = h._interval64
                        }
                    }
                } else {
                    if (g.int64 === false) {
                        var f = g.max - g.min;
                        e = f / h.number
                    } else {
                        var f = g._max64.subtract(g._min64);
                        if (g.int64 === "s") {
                            e = f.div(new d.jqx.math().fromNumber(h.number))
                        } else {
                            e = f.divide(new BigNumber(h.number))
                        }
                    }
                }
                return e
            },
            _getMaxLabelSize: function() {
                var f = this,
                    j = this.max,
                    e = this.min;
                e = f._formatLabel(e);
                j = f._formatLabel(j);
                var h = d('<div style="position: absolute; visibility: hidden;" class="' + f.toThemeProperty("jqx-gauge-label") + '"></div>');
                h.css({
                    "font-size": f.labels.fontSize,
                    "font-family": f.labels.fontFamily,
                    "font-weight": f.labels.fontWeight,
                    "font-style": f.labels.fontStyle
                });
                d("body").append(h);
                h.html(e);
                var g = {
                    width: h.width(),
                    height: h.height()
                };
                h.html(j);
                var i = {
                    width: h.width(),
                    height: h.height()
                };
                h.remove();
                if (g.width > i.width) {
                    return g
                }
                return i
            },
            disable: function() {
                this.disabled = true;
                this.host.addClass(this.toThemeProperty("jqx-fill-state-disabled"))
            },
            enable: function() {
                this.disabled = false;
                this.host.removeClass(this.toThemeProperty("jqx-fill-state-disabled"))
            },
            destroy: function() {
                var e = this;
                if (e._timeout) {
                    clearTimeout(this._timeout)
                }
                e._timeout = null;
                d.jqx.utilities.resize(e.host, null, true);
                e._removeElements();
                e.renderer.clear();
                e.renderer = null;
                var f = d.data(e.element, "jqxGauge");
                if (f) {
                    delete f.instance
                }
                e.host.children().remove();
                e._caption = null;
                e._caption = null;
                e._pointer = null;
                e._labels = [];
                e._cap = null;
                e._ticks = [];
                e._ranges = [];
                e._border = null;
                e._gauge = null;
                e._caption = null;
                e.renderer = null;
                e._animations = [];
                e.host.removeData();
                e.host.removeClass();
                e.host.remove();
                e.that = null;
                e.element = null;
                e._gaugeParent = null;
                delete e._gaugeParent;
                delete e.element;
                delete e.host
            },
            _validatePercentage: function(f, e) {
                if (parseFloat(f) !== 0 && (!f || !parseInt(f, 10))) {
                    f = e
                }
                return f
            },
            _getColorScheme: function(f) {
                var e;
                for (var g = 0; g < this._schemes.length; g += 1) {
                    e = this._schemes[g];
                    if (e.name === f) {
                        return e.colors
                    }
                }
                return null
            },
            setValue: function(f, g) {
                var e = this;
                if (!e.disabled) {
                    g = g || e.animationDuration || 0;
                    if (e.int64 === "s") {
                        if (typeof f === "number") {
                            f = new d.jqx.math().fromNumber(f, 10)
                        } else {
                            if (typeof f === "string") {
                                f = new d.jqx.math().fromString(f, 10)
                            }
                        }
                        if (f.greaterThan(e._max64)) {
                            f = new d.jqx.math().fromString(e._max64.toString(), 10)
                        }
                        if (f.lessThan(e._min64)) {
                            f = new d.jqx.math().fromString(e._min64.toString(), 10)
                        }
                        e._animate(e._value64, f, g)
                    } else {
                        if (e.int64 === "u") {
                            f = new BigNumber(f);
                            if (f.compare(e._max64) === 1) {
                                f = new BigNumber(e._max64)
                            }
                            if (f.compare(e._min64) === -1) {
                                f = new BigNumber(e._min64)
                            }
                            e._animate(e._value64, f, g)
                        } else {
                            if (f > e.max) {
                                f = e.max
                            }
                            if (f < e.min) {
                                f = e.min
                            }
                            e._animate(e.value, f, g)
                        }
                    }
                    d.jqx.aria(e, "aria-valuenow", f.toString())
                }
            },
            _animate: function(h, e, g) {
                var f = this;
                if (f._timeout) {
                    f._endAnimation(f.int64 ? f._value64 : f.value, false)
                }
                if (!g) {
                    f._endAnimation(e, true);
                    return
                }
                f._animateHandler(h, e, 0, g)
            },
            _animateHandler: function(i, e, h, g) {
                var f = this;
                if (h <= g) {
                    this._timeout = setTimeout(function() {
                        if (f.int64 !== false) {
                            var k = e.subtract(i);
                            if (f.int64 === "s") {
                                var j = new d.jqx.math().fromNumber((d.easing[f.easing](h / g, h, 0, 1, g)) * 100, 10);
                                f._value64 = i.add(k.multiply(j).div(new d.jqx.math().fromNumber(100, 10)))
                            } else {
                                var j = new BigNumber((d.easing[f.easing](h / g, h, 0, 1, g)) * 100);
                                f._value64 = i.add(k.multiply(j).divide(100))
                            }
                            f.value = f._value64.toString();
                            f._setValue(f._value64)
                        } else {
                            f.value = i + (e - i) * d.easing[f.easing](h / g, h, 0, 1, g);
                            f._setValue(f.value)
                        }
                        f._raiseEvent(0, {
                            value: f.value.toString()
                        });
                        f._animateHandler(i, e, h + f._animationTimeout, g)
                    }, this._animationTimeout)
                } else {
                    this._endAnimation(e, true)
                }
            },
            _endAnimation: function(e, f) {
                clearTimeout(this._timeout);
                this._timeout = null;
                this._setValue(e);
                if (f) {
                    this._raiseEvent(1, {
                        value: e.toString()
                    })
                }
            },
            _getMaxTickSize: function() {
                return Math.max(this._getSize(this.ticksMajor.size), this._getSize(this.ticksMinor.size))
            },
            _raiseEvent: function(g, f) {
                var h = d.Event(this._events[g]),
                    e;
                h.args = f || {};
                e = this.host.trigger(h);
                return e
            },
            _getNiceInterval: function(k, h) {
                function A(C) {
                    return Math.log(parseFloat(C)) / Math.LN10
                }

                function v() {
                    var C = Math.abs(n.startAngle - n.endAngle) * n._innerRadius;
                    return Math.round(C)
                }
                var n = this,
                    B = "width";
                if (k === "linear" && n.orientation === "vertical") {
                    B = "height"
                }
                var g = d.jqx.browser.msie ? 0 : 1;
                var f;
                var j = d('<span class="' + n.toThemeProperty("jqx-gauge-label") + '" style="position: absolute; visibility: hidden;"></span>'),
                    y = n._formatLabel(n.min),
                    z = n._formatLabel(n.max);
                j.css({
                    "font-size": n.labels.fontSize,
                    "font-family": n.labels.fontFamily,
                    "font-weight": n.labels.fontWeight,
                    "font-style": n.labels.fontStyle
                });
                d("body").append(j);
                j.text(y);
                var x = j[B]() + g;
                j.text(z);
                var l = j[B]() + g;
                j.remove();
                var f = Math.max(l, x);
                var o = 1;
                if (k === "radial") {
                    var r;
                    if (n._innerRadius < 50) {
                        r = 0.3
                    } else {
                        if (n._innerRadius < 150) {
                            r = 0.6
                        } else {
                            if (n._innerRadius < 250) {
                                r = 0.7
                            } else {
                                r = 1
                            }
                        }
                    }
                    o = 8 / Math.max(1, A(n._innerRadius)) * r
                } else {
                    var m = 0;
                    if (f > 105) {
                        m = (f - 105) / 100
                    }
                    o = 1.5 + m
                }
                f *= o;
                var e;
                if (k === "radial") {
                    e = v()
                } else {
                    e = n._getScaleLength()
                }
                var i = Math.ceil(e / f),
                    t, w, p, u, q, s;
                if (h === true) {
                    if (k === "radial") {
                        i *= 4
                    } else {
                        i *= 3
                    }
                }
                if (n.int64 === false) {
                    t = n.max - n.min;
                    w = Math.floor(A(t) - A(i));
                    p = Math.pow(10, w);
                    u = i * p;
                    q;
                    if (t < 2 * u) {
                        q = 1
                    } else {
                        if (t < 3 * u) {
                            q = 2
                        } else {
                            if (t < 7 * u) {
                                q = 5
                            } else {
                                q = 10
                            }
                        }
                    }
                    s = q * p
                } else {
                    t = new BigNumber(n.max).subtract(new BigNumber(n.min));
                    w = Math.floor(A(t.toString()) - A(i));
                    p = new BigNumber(10).pow(new BigNumber(w));
                    u = new BigNumber(i).multiply(p);
                    q;
                    if (t.compare(new BigNumber(2 * u)) === -1) {
                        q = 1
                    } else {
                        if (t.compare(new BigNumber(3 * u)) === -1) {
                            q = 2
                        } else {
                            if (t.compare(new BigNumber(7 * u)) === -1) {
                                q = 5
                            } else {
                                q = 10
                            }
                        }
                    }
                    s = new BigNumber(q).multiply(p);
                    if (s.compare(1) === -1) {
                        s = new BigNumber(1)
                    }
                    if (n.int64 === "s") {
                        s = new d.jqx.math().fromString(s.toString())
                    }
                }
                return s
            },
            _styleLabels: function() {
                return;
                var f = this,
                    e = f.labels,
                    g = f.host.find(".jqx-gauge-label");
                g.css({
                    "font-size": e.fontSize,
                    "font-family": e.fontFamily,
                    "font-weight": e.fontWeight,
                    "font-style": e.fontStyle
                })
            },
            _checkForOverflow: function(h, f) {
                var e = new BigNumber("9223372036854775807"),
                    g = new BigNumber(h.toString()),
                    i = new BigNumber(f.toString());
                if (g.add(i).compare(e) === 1) {
                    return true
                } else {
                    return false
                }
            },
            _formatLabel: function(i, e) {
                var h = this,
                    f = h.labels.formatValue,
                    j = h.labels.formatSettings,
                    g;
                if (f) {
                    g = f(i, e)
                } else {
                    if (j) {
                        if (j.radix !== undefined) {
                            g = new d.jqx.math().getRadixValue(i, h.int64, j.radix)
                        } else {
                            if (j.outputNotation !== undefined && j.outputNotation !== "default" && j.outputNotation !== "decimal") {
                                g = new d.jqx.math().getDecimalNotation(i, j.outputNotation, j.decimalDigits, j.digits)
                            } else {
                                if (j.decimalDigits !== undefined) {
                                    g = Number(i).toFixed(j.decimalDigits)
                                } else {
                                    if (j.digits !== undefined) {
                                        g = Number(i).toPrecision(j.digits)
                                    }
                                }
                            }
                        }
                    } else {
                        g = i
                    }
                }
                return g
            },
            _editableLabels: function(j) {
                var k = this;

                function f(p, q) {
                    var o = k.renderer.measureText(k._formatLabel(q), 0, {
                        "class": k.toThemeProperty("jqx-gauge-label")
                    });
                    i.offset(d(p).offset());
                    n.style.width = (o.width + 10) + "px";
                    n.style.height = o.height + "px";
                    n.style.visibility = "visible";
                    n.value = q;
                    i.select()
                }
                if (k.editableLabels) {
                    var h = k._labels;
                    if (h.length === 0) {
                        return
                    }
                    var g = h[0],
                        m = h[h.length - 1],
                        n, i;
                    if (j !== true) {
                        n = document.createElement("input");
                        i = d(n);
                        n.className = "jqx-gauge-label-input";
                        k.element.appendChild(n)
                    } else {
                        i = k.host.children("input");
                        n = i[0]
                    }
                    g.style.cursor = "text";
                    m.style.cursor = "text";
                    k.addHandler(d(g), "dblclick.jqxGauge" + k.element.id, function(o) {
                        f(this, k.min);
                        k._editedProperty = "min"
                    });
                    k.addHandler(d(m), "dblclick.jqxGauge" + k.element.id, function(o) {
                        f(this, k.max);
                        k._editedProperty = "max"
                    });
                    var e = /^-?\d+\.?\d*$/;

                    function l(t, r, s, p) {
                        if (t === k[r].toString()) {
                            return false
                        }
                        if (k.int64 === "s") {
                            var q = new d.jqx.math().fromString(t, 10);
                            if ((r === "min" && q.compare(k["_" + p + "64"]) !== -1) || (r === "max" && q.compare(k["_" + p + "64"]) !== 1)) {
                                return false
                            }
                            k[s] = q;
                            k[r] = t
                        } else {
                            if (k.int64 === "u") {
                                var o = new BigNumber(t);
                                if (o.compare(0) === -1 || (r === "min" && o.compare(k["_" + p + "64"]) !== -1) || (r === "max" && o.compare(k["_" + p + "64"]) !== 1)) {
                                    return false
                                }
                                k[s] = o;
                                k[r] = t
                            } else {
                                if ((r === "min" && t >= k[p]) || (r === "max" && t <= k[p])) {
                                    return false
                                }
                                k[r] = parseFloat(t)
                            }
                        }
                    }
                    if (j !== true) {
                        k.addHandler(i, "blur.jqxGauge" + k.element.id, function(p) {
                            var q = this.value,
                                o;
                            n.style.visibility = "hidden";
                            if (!e.test(q)) {
                                return
                            }
                            if (k._editedProperty === "min") {
                                o = l(q, "min", "_min64", "max");
                                if (o === false) {
                                    return
                                }
                                d.jqx.aria(k, "aria-valuemin", q)
                            } else {
                                o = l(q, "max", "_max64", "min");
                                if (o === false) {
                                    return
                                }
                                d.jqx.aria(k, "aria-valuemax", q)
                            }
                            k.refresh();
                            if (k.renderer instanceof d.jqx.HTML5Renderer) {
                                k.renderer.refresh()
                            }
                        })
                    }
                }
            }
        },
        a = {
            defineInstance: function() {
                var e = {
                    int64: false,
                    editableLabels: false,
                    value: -50,
                    max: 40,
                    min: -60,
                    width: 100,
                    height: 300,
                    pointer: {},
                    labels: {},
                    animationDuration: 1000,
                    showRanges: {},
                    ticksMajor: {
                        size: "15%",
                        interval: 5
                    },
                    ticksMinor: {
                        size: "10%",
                        interval: 2.5
                    },
                    tickMode: "default",
                    niceInterval: false,
                    ranges: [],
                    easing: "easeOutCubic",
                    colorScheme: "scheme01",
                    disabled: false,
                    rangesOffset: 0,
                    background: {},
                    ticksPosition: "both",
                    rangeSize: "5%",
                    scaleStyle: null,
                    ticksOffset: null,
                    scaleLength: "90%",
                    orientation: "vertical",
                    aria: {
                        "aria-valuenow": {
                            name: "value",
                            type: "number"
                        },
                        "aria-valuemin": {
                            name: "min",
                            type: "number"
                        },
                        "aria-valuemax": {
                            name: "max",
                            type: "number"
                        },
                        "aria-disabled": {
                            name: "disabled",
                            type: "boolean"
                        }
                    },
                    displayTank: false,
                    tankStyle: null,
                    _originalColor: "",
                    _width: null,
                    _height: null,
                    renderer: null
                };
                d.extend(true, this, e);
                return e
            },
            createInstance: function() {
                d.jqx.aria(this);
                this.host.css("overflow", "hidden");
                this.host.addClass(this.toThemeProperty("jqx-widget"));
                this.host.append('<input class="jqx-gauge-label-input"/>');
                var e = this;
                if (e.int64 === "s") {
                    if (!d.jqx.longInt) {
                        throw new Error("jqxLinearGauge: Missing reference to jqxmath.js")
                    }
                    d.jqx.longInt(e);
                    e._value64 = new d.jqx.math().fromString(e.value.toString(), 10);
                    e._min64 = new d.jqx.math().fromString(e.min.toString(), 10);
                    e._max64 = new d.jqx.math().fromString(e.max.toString(), 10)
                } else {
                    if (e.int64 === "u") {
                        try {
                            BigNumber
                        } catch (f) {
                            throw new Error("jqxLinearGauge: Missing reference to jqxmath.js")
                        }
                        e._value64 = new BigNumber(e.value);
                        e._min64 = new BigNumber(e.min);
                        e._max64 = new BigNumber(e.max)
                    }
                }
                d.jqx.utilities.resize(this.host, function() {
                    e.refresh(false, false)
                })
            },
            val: function(e) {
                if (arguments.length == 0 || typeof(e) == "object") {
                    return this.value
                }
                this.setValue(e, 0)
            },
            _initRenderer: function(e) {
                if (!d.jqx.createRenderer) {
                    throw "Please include a reference to jqxdraw.js"
                }
                return d.jqx.createRenderer(this, e)
            },
            refresh: function(i, h) {
                var f = this;
                f._nearLabels = [];
                f._farLabels = [];
                if (!f.renderer) {
                    f._isVML = false;
                    f.host.empty();
                    f._initRenderer(f.host)
                }
                var g = f.renderer;
                if (!g) {
                    return
                }
                f._validateProperties();
                f._reset();
                f._init();
                f._performLayout();
                f._render();
                if (h !== false) {
                    f.setValue(f.value, 1)
                }
                if (!i) {
                    var e = f.labels.position;
                    if (e === "both" || e === "near") {
                        f._labels = f._nearLabels;
                        f._editableLabels()
                    }
                    if (e === "both" || e === "far") {
                        f._labels = f._farLabels;
                        f._editableLabels(e === "both" ? true : undefined)
                    }
                }
            },
            _getBorderSize: function() {
                var f = 1,
                    e;
                if (this._isVML) {
                    f = 0
                }
                if (this.background) {
                    e = (parseInt(this.background.style["stroke-width"], 10) || f) / 2;
                    if (this._isVML) {
                        return Math.round(e)
                    }
                    return e
                }
                return f
            },
            _validateProperties: function() {
                this.background = this._backgroundConstructor(this.background, this);
                this.ticksOffset = this.ticksOffset || this._getDefaultTicksOffset();
                this.rangesOffset = this.rangesOffset || 0;
                this.rangeSize = this._validatePercentage(this.rangeSize, 5);
                this.ticksOffset[0] = this._validatePercentage(this.ticksOffset[0], "5%");
                this.ticksOffset[1] = this._validatePercentage(this.ticksOffset[1], "5%");
                this.ticksMinor = this._tickConstructor(this.ticksMinor, this);
                this.ticksMajor = this._tickConstructor(this.ticksMajor, this);
                this.scaleStyle = this.scaleStyle || this.ticksMajor.style;
                this.labels = this._labelsConstructor(this.labels, this);
                this.pointer = this._pointerConstructor(this.pointer, this);
                for (var e = 0; e < this.ranges.length; e += 1) {
                    this.ranges[e] = this._rangeConstructor(this.ranges[e], this)
                }
            },
            _getDefaultTicksOffset: function() {
                if (this.orientation === "horizontal") {
                    return ["5%", "36%"]
                }
                return ["36%", "5%"]
            },
            _handleOrientation: function() {
                if (this.orientation === "vertical") {
                    d.extend(this, linearVerticalGauge)
                } else {
                    d.extend(this, linearHorizontalGauge)
                }
            },
            _reset: function() {
                this.host.empty()
            },
            _performLayout: function() {
                var e = parseInt(this.background.style["stroke-width"], 10) || 1;
                this._width -= e;
                this._height -= e;
                this.host.css("padding", e / 2)
            },
            _init: function() {
                var f = this._getBorderSize(),
                    e;
                this._width = this._getScale(this.width, "width", this.host.parent()) - 3;
                this._height = this._getScale(this.height, "height", this.host.parent()) - 3;
                this.element.innerHTML = "<div/>";
                this.host.width(this._width);
                this.host.height(this._height);
                this.host.children().width(this._width);
                this.host.children().height(this._height);
                this.renderer.init(this.host.children());
                e = this.renderer.getContainer();
                e.width(this._width);
                e.height(this._height)
            },
            _render: function() {
                this._renderBackground();
                this._renderTicks();
                if (!this.niceInterval) {
                    this._renderLabels()
                }
                this._styleLabels();
                this._renderRanges();
                this._renderPointer()
            },
            _renderBackground: function() {
                if (!this.background.visible) {
                    return
                }
                var g = this.background.style,
                    f = d.jqx._rup(this._getBorderSize()),
                    e = "rect",
                    h;
                g = this._handleShapeOptions(g);
                if (this.background.backgroundType === "roundedRectangle" && this._isVML) {
                    e = "roundrect"
                }
                if (!this._Vml) {
                    g.x = f;
                    g.y = f
                }
                h = this.renderer.shape(e, g);
                if (this._isVML) {
                    this._fixVmlRoundrect(h, g)
                }
            },
            _handleShapeOptions: function(g) {
                var e = this.background.style.fill,
                    f = this._getBorderSize();
                if (!e) {
                    e = "#cccccc"
                }
                if (this.background.showGradient) {
                    if (e.indexOf("url") < 0 && e.indexOf("#grd") < 0) {
                        this._originalColor = e
                    } else {
                        e = this._originalColor
                    }
                    e = this.renderer._toLinearGradient(e, this.orientation === "horizontal", [
                        [1, 1.1],
                        [90, 1.5]
                    ])
                }
                this.background.style.fill = e;
                if (this.background.backgroundType === "roundedRectangle") {
                    if (this._isVML) {
                        g.arcsize = this.background.borderRadius + "%"
                    } else {
                        g.rx = this.background.borderRadius;
                        g.ry = this.background.borderRadius
                    }
                }
                g.width = this._width - 1;
                g.height = this._height - 1;
                return g
            },
            _fixVmlRoundrect: function(g, f) {
                var e = this._getBorderSize();
                g.style.position = "absolute";
                g.style.left = e;
                g.style.top = e;
                g.style.width = this._width - 1;
                g.style.height = this._height - 1;
                g.strokeweight = 0;
                delete f.width;
                delete f.height;
                delete f.arcsize;
                this.renderer.attr(g, f)
            },
            _renderTicks: function() {
                var k = this.ticksMinor,
                    l = this.ticksMajor,
                    f, i, h, g, e, m, j;
                if (this.int64 === "s") {
                    f = this._max64.subtract(this._min64);
                    if (f.isNegative()) {
                        f = f.negate()
                    }
                    if (this.tickMode === "default") {
                        if (this.niceInterval) {
                            i = this._getNiceInterval("linear");
                            h = this._getNiceInterval("linear", true)
                        } else {
                            i = l._interval64;
                            h = k._interval64
                        }
                    } else {
                        i = f.div(new d.jqx.math().fromNumber(l.number));
                        h = f.div(new d.jqx.math().fromNumber(k.number))
                    }
                } else {
                    if (this.int64 === "u") {
                        f = this._max64.subtract(this._min64).abs();
                        if (this.tickMode === "default") {
                            if (this.niceInterval) {
                                i = this._getNiceInterval("linear");
                                h = this._getNiceInterval("linear", true)
                            } else {
                                i = l._interval64;
                                h = k._interval64
                            }
                        } else {
                            i = f.divide(new BigNumber(l.number));
                            h = f.divide(new BigNumber(k.number))
                        }
                    } else {
                        f = Math.abs(this.max - this.min);
                        if (this.tickMode === "default") {
                            if (this.niceInterval) {
                                i = this._getNiceInterval("linear");
                                h = this._getNiceInterval("linear", true)
                            } else {
                                i = l.interval;
                                h = k.interval
                            }
                        } else {
                            i = f / l.number;
                            h = f / k.number
                        }
                    }
                }
                m = {
                    size: this._getSize(l.size),
                    style: l.style,
                    visible: l.visible,
                    interval: i,
                    type: "major"
                };
                j = {
                    size: this._getSize(k.size),
                    style: k.style,
                    visible: k.visible,
                    interval: h,
                    checkOverlap: true,
                    type: "minor"
                };
                if (this.ticksPosition === "near" || this.ticksPosition === "both") {
                    this._ticksRenderHandler(m);
                    this._ticksRenderHandler(j)
                }
                if (this.ticksPosition === "far" || this.ticksPosition === "both") {
                    m.isFar = true;
                    j.isFar = true;
                    this._ticksRenderHandler(m);
                    this._ticksRenderHandler(j)
                }
                this._renderConnectionLine()
            },
            _ticksRenderHandler: function(f) {
                if (!f.visible && f.type === "minor") {
                    return
                }
                var i = this._getSize(this.ticksOffset[0], "width"),
                    g = this._getSize(this.ticksOffset[1], "height"),
                    e = this._getBorderSize(),
                    h = this._calculateTickOffset() + this._getMaxTickSize();
                if (f.isFar) {
                    h += f.size
                }
                this._drawTicks(f, e, h + e)
            },
            _drawTicks: function(u, l, r) {
                var t = this,
                    k = u.interval,
                    p, m = t.orientation === "vertical" ? "width" : "height",
                    j = t.orientation === "vertical" ? "height" : "width",
                    e = t._getMaxLabelSize()[m],
                    q = t._getMaxLabelSize()[j],
                    h = t._getInterval("ticksMajor"),
                    g = t._getInterval("ticksMinor");

                function o(w) {
                    p = t._valueToCoordinates(w);
                    if (!u.checkOverlap || !t._overlapTick(w, h, g)) {
                        if (u.visible) {
                            t._renderTick(u.size, p, u.style, r)
                        }
                        if (t.niceInterval && t.labels.visible) {
                            var x, B, A;
                            if (t.orientation === "vertical") {
                                A = t._getSize(t.ticksOffset[1], "height")
                            } else {
                                A = t._getSize(t.ticksOffset[0], "width")
                            }
                            A += l;
                            var v = u.isFar ? "far" : "near",
                                y;
                            if (v === "near") {
                                y = t._calculateTickOffset() - e + l + t._getSize(t.labels.offset)
                            } else {
                                y = t._calculateTickOffset() + 2 * t._getMaxTickSize() + e + l + t._getSize(t.labels.offset)
                            }
                            if (t.int64 === false) {
                                if (w !== t.min && Math.abs(t._valueToCoordinates(t.min) - p) < q) {
                                    return
                                }
                                if (w !== t.max && Math.abs(t._valueToCoordinates(t.max) - p) < q) {
                                    return
                                }
                            } else {
                                if (t.int64 === "s") {
                                    if (w.equals(t._min64) === false && Math.abs(t._valueToCoordinates(t._min64) - p) < q) {
                                        return false
                                    }
                                    if (w.equals(t._max64) === false && Math.abs(t._valueToCoordinates(t._max64) - p) < q) {
                                        return
                                    }
                                } else {
                                    if (t.int64 === "u") {
                                        if (w.compare(t._min64) !== 0 && Math.abs(t._valueToCoordinates(t._min64) - p) < q) {
                                            return false
                                        }
                                        if (w.compare(t._max64) !== 0 && Math.abs(t._valueToCoordinates(t._max64) - p) < q) {
                                            return
                                        }
                                    }
                                }
                            }
                            var z = t.labels.position;
                            if (u.type === "major" && (z === "both" || z === "near" && u.isFar !== true || z === "far" && u.isFar)) {
                                t._renderLabel(p, v, y, e, w)
                            }
                        }
                    }
                }
                if (t.niceInterval) {
                    var f;
                    if (t.int64 === "s") {
                        o(t._min64);
                        f = t._min64.subtract(t._min64.modulo(k)).add(k);
                        if (u.type === "minor") {
                            for (var s = f; s.greaterThanOrEqual(t._min64); s = s.subtract(k)) {
                                f = s
                            }
                        }
                        for (var n = f; n.lessThan(t._max64); n = n.add(k)) {
                            if (t._checkForOverflow(n, k)) {
                                break
                            }
                            o(n)
                        }
                        o(t._max64)
                    } else {
                        if (t.int64 === "u") {
                            o(t._min64);
                            f = t._min64.subtract(t._min64.mod(k)).add(k);
                            if (u.type === "minor") {
                                for (var s = f; s.compare(t._min64) !== -1; s = s.subtract(k)) {
                                    f = s
                                }
                            }
                            for (var n = f; n.compare(t._max64) === -1; n = n.add(k)) {
                                o(n)
                            }
                            o(t._max64)
                        } else {
                            o(t.min);
                            f = t.min - (t.min % k) + k;
                            if (u.type === "minor") {
                                for (var s = f; s >= t.min; s = s - k) {
                                    f = s
                                }
                            }
                            for (var n = f; n <= t.max; n += k) {
                                o(n)
                            }
                            o(t.max)
                        }
                    }
                } else {
                    if (t.int64 === "s") {
                        for (var n = new d.jqx.math().fromString(t._min64.toString(), 10); n.lessThanOrEqual(t._max64); n = n.add(k)) {
                            o(n)
                        }
                    } else {
                        if (t.int64 === "u") {
                            for (var n = new BigNumber(t._min64); n.compare(t._max64) !== 1; n = n.add(k)) {
                                o(n)
                            }
                        } else {
                            for (var n = t.min; n <= t.max; n += k) {
                                o(n)
                            }
                        }
                    }
                }
            },
            _calculateTickOffset: function() {
                var f = this._getSize(this.ticksOffset[0], "width"),
                    e = this._getSize(this.ticksOffset[1], "height"),
                    g = e;
                if (this.orientation === "vertical") {
                    g = f
                }
                return g
            },
            _getInterval: function(g) {
                var i = this,
                    f;
                if (i.tickMode === "default") {
                    if (i.niceInterval === true) {
                        f = i._getNiceInterval("linear", g === "ticksMinor")
                    } else {
                        if (i.int64 !== false) {
                            f = i[g]._interval64
                        } else {
                            f = i[g].interval
                        }
                    }
                } else {
                    var h = i[g].number,
                        e;
                    if (i.int64 !== false) {
                        e = i._max64.subtract(i._min64);
                        if (i.int64 === "s") {
                            f = e.div(new d.jqx.math().fromNumber(h))
                        } else {
                            f = e.divide(new BigNumber(h))
                        }
                    } else {
                        e = i.max - i.min;
                        f = e / i[g].number
                    }
                }
                return f
            },
            _overlapTick: function(g, e, f) {
                if (this.int64 === "s") {
                    g = g.add(this._min64);
                    if ((g.modulo(f)).equals(g.modulo(e))) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    if (this.int64 === "u") {
                        g = g.add(this._min64);
                        if ((g.mod(f)).compare(g.mod(e)) === 0) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        g += this.min;
                        if (g % f === g % e) {
                            return true
                        }
                        return false
                    }
                }
            },
            _renderConnectionLine: function() {
                if (!this.ticksMajor.visible && !this.ticksMinor.visible) {
                    return
                }
                var g = this._getScaleLength(),
                    f = this._getBorderSize(),
                    i, k, j = this._getMaxTickSize(),
                    h = j + f;
                if (this.int64 !== false) {
                    i = this._valueToCoordinates(this._max64);
                    k = this._valueToCoordinates(this._min64)
                } else {
                    i = this._valueToCoordinates(this.max);
                    k = this._valueToCoordinates(this.min)
                }
                if (this.orientation === "vertical") {
                    h += this._getSize(this.ticksOffset[0], "width");
                    this.renderer.line(h, i, h, k, this.scaleStyle)
                } else {
                    h += this._getSize(this.ticksOffset[1], "height");
                    var e = this._getSize(this.ticksOffset[0], "width");
                    this.renderer.line(e + i - k, h, e, h, this.scaleStyle)
                }
            },
            _getScaleLength: function() {
                return this._getSize(this.scaleLength, (this.orientation === "vertical" ? "height" : "width"))
            },
            _renderTick: function(e, i, f, h) {
                var g = this._handleTickCoordinates(e, i, h);
                this.renderer.line(Math.round(g.x1), Math.round(g.y1), Math.round(g.x2), Math.round(g.y2), f)
            },
            _handleTickCoordinates: function(e, g, f) {
                if (this.orientation === "vertical") {
                    return {
                        x1: f - e,
                        x2: f,
                        y1: g,
                        y2: g
                    }
                }
                return {
                    x1: g,
                    x2: g,
                    y1: f - e,
                    y2: f
                }
            },
            _getTickCoordinates: function(f, g) {
                var e = this._handleTickCoordinates(f, 0, this._calculateTickOffset());
                if (this.orientation === "vertical") {
                    e = e.x1
                } else {
                    e = e.y1
                }
                e += f;
                return e
            },
            _renderLabels: function() {
                if (!this.labels.visible) {
                    return
                }
                var g = this._getSize(this.ticksOffset[0], "width"),
                    i = this._getMaxTickSize(),
                    k = this.labels.position,
                    j = "height",
                    f = this._getBorderSize(),
                    h = this._calculateTickOffset() + i,
                    e;
                if (this.orientation === "vertical") {
                    g = this._getSize(this.ticksOffset[1], "height");
                    j = "width"
                }
                e = this._getMaxLabelSize()[j];
                if (k === "near" || k === "both") {
                    this._labelListRender(h - i - e + f, g + f, e, "near")
                }
                if (k === "far" || k === "both") {
                    this._labelListRender(h + i + e + f, g + f, e, "far")
                }
            },
            _labelListRender: function(l, e, f, o) {
                var h, p, j, q, n, k, g = this._getScaleLength();
                l += this._getSize(this.labels.offset);
                if (this.int64 !== false) {
                    n = this._max64.subtract(this._min64);
                    if (this.tickMode === "default") {
                        h = this.labels._interval64;
                        if (this.int64 === "s") {
                            p = n.div(h).toNumber()
                        } else {
                            p = parseFloat((n).divide(h).toString())
                        }
                    } else {
                        p = this.labels.number;
                        if (this.int64 === "s") {
                            h = n.div(new d.jqx.math().fromNumber(p))
                        } else {
                            h = n.divide(p)
                        }
                    }
                    q = (this.orientation === "vertical") ? this._max64 : this._min64
                } else {
                    n = Math.abs(this.max - this.min);
                    if (this.tickMode === "default") {
                        h = this.labels.interval;
                        p = n / h
                    } else {
                        p = this.labels.number;
                        h = n / p
                    }
                    q = (this.orientation === "vertical") ? this.max : this.min
                }
                j = g / p;
                for (var m = 0; m <= p; m += 1) {
                    this._renderLabel(e, o, l, f, q);
                    if (this.int64 !== false) {
                        q = (this.orientation === "vertical") ? q.subtract(h) : q.add(h)
                    } else {
                        q += (this.orientation === "vertical") ? -h : h
                    }
                    e += j
                }
            },
            _renderLabel: function(g, o, l, h, r) {
                var p = this,
                    k = p.labels,
                    j = {
                        "class": this.toThemeProperty("jqx-gauge-label")
                    },
                    i = this.labels.interval,
                    n, e, m, q;
                var f = "";
                if (k.fontSize) {
                    f += "font-size: " + k.fontSize + ";"
                }
                if (k.fontFamily) {
                    f += "font-family: " + k.fontFamily
                }
                if (k.fontWeight) {
                    f += "font-weight: " + k.fontWeight
                }
                if (k.fontStyle) {
                    f += "font-style: " + k.fontStyle
                }
                if (f !== "") {
                    j.style = f
                }
                m = this._formatLabel(r.toString(), o);
                e = this.renderer.measureText(m, 0, j);
                if (this.orientation === "vertical") {
                    n = (o === "near") ? h - e.width : 0;
                    q = this.renderer.text(m, Math.round(l) + n - h / 2, Math.round(g - e.height / 2), e.width, e.height, 0, j)
                } else {
                    n = (o === "near") ? h - e.height : 0;
                    q = this.renderer.text(m, Math.round(g - e.width / 2), Math.round(l) + n - h / 2, e.width, e.height, 0, j)
                }
                if (o === "near") {
                    if (this.niceInterval || this.orientation === "horizontal") {
                        this._nearLabels.push(q)
                    } else {
                        this._nearLabels.unshift(q)
                    }
                } else {
                    if (this.niceInterval || this.orientation === "horizontal") {
                        this._farLabels.push(q)
                    } else {
                        this._farLabels.unshift(q)
                    }
                }
            },
            _renderRanges: function() {
                if (!this.showRanges) {
                    return
                }
                var h = (this.orientation === "vertical") ? "width" : "height",
                    j = this._getSize(this.rangesOffset, h),
                    g = this._getSize(this.rangeSize, h),
                    e;
                for (var f = 0; f < this.ranges.length; f += 1) {
                    e = this.ranges[f];
                    e.size = g;
                    this._renderRange(e, j)
                }
            },
            _renderRange: function(q, k) {
                var h = this._getScaleLength(),
                    j = this._getBorderSize(),
                    i = this._getSize(this.ticksOffset[0], "width"),
                    g = this._getSize(this.ticksOffset[1], "height"),
                    n = this._getMaxTickSize(),
                    p = this._getSize(q.size),
                    m, f;
                if (this.int64 !== false) {
                    m = this._valueToCoordinates(q._endValue64);
                    f = q._startValue64;
                    if (this.int64 === "s" && f.lessThan(this._min64)) {
                        f = new d.jqx.math().fromString(this._min64.toString(), 10)
                    } else {
                        if (this.int64 === "u" && f.compare(this._min64) === -1) {
                            f = new BigNumber(this._min64)
                        }
                    }
                } else {
                    m = this._valueToCoordinates(q.endValue);
                    f = q.startValue;
                    if (f < this.min) {
                        f = this.min
                    }
                }
                var o = Math.abs(this._valueToCoordinates(f) - m),
                    l, e;
                if (this.orientation === "vertical") {
                    l = this.renderer.rect(i + n + k - p + j, m, q.size, o, q.style)
                } else {
                    e = o;
                    l = this.renderer.rect(this._valueToCoordinates(f), g + n + j, e, q.size, q.style)
                }
                this.renderer.attr(l, q.style)
            },
            _renderPointer: function() {
                if (!this.pointer.visible) {
                    return
                }
                if (this.pointer.pointerType === "default") {
                    this._renderColumnPointer()
                } else {
                    this._renderArrowPointer()
                }
            },
            _renderColumnPointer: function() {
                if (this.displayTank) {
                    var e = {
                        fill: "#FFFFFF"
                    };
                    e["fill-opacity"] = 0;
                    if (this.tankStyle) {
                        e.stroke = this.tankStyle.stroke;
                        e["stroke-width"] = this.tankStyle.strokeWidth
                    } else {
                        e.stroke = "#A1A1A1";
                        e["stroke-width"] = "1px"
                    }
                    this._tank = this.renderer.rect(0, 0, 0, 0, e);
                    this._performTankLayout()
                }
                this._pointer = this.renderer.rect(0, 0, 0, 0, this.pointer.style);
                this.renderer.attr(this._pointer, this.pointer.style);
                if (this.int64 !== false) {
                    this._setValue(this._value64)
                } else {
                    this._setValue(this.value)
                }
            },
            _performTankLayout: function() {
                var e, h, o, l = this._valueToCoordinates(),
                    j = this._getBorderSize(),
                    i = this._getSize(this.ticksOffset[0], "width"),
                    g = this._getSize(this.ticksOffset[1], "height"),
                    m = this._getMaxTickSize(),
                    f = this._getSize(this.pointer.size),
                    k = this._getSize(this.pointer.offset),
                    n = {};
                if (this.int64 !== false) {
                    l = this._valueToCoordinates(this._max64);
                    e = this._valueToCoordinates(this._min64)
                } else {
                    l = this._valueToCoordinates(this.max);
                    e = this._valueToCoordinates(this.min)
                }
                o = Math.abs(e - l);
                if (this.orientation === "vertical") {
                    h = i + m;
                    n = {
                        left: h + k + 1 + j,
                        top: l,
                        height: o,
                        width: f
                    }
                } else {
                    h = g + m;
                    n = {
                        left: e,
                        top: h + k - f - 1 + j,
                        height: f,
                        width: o
                    }
                }
                if (!this._isVML) {
                    this.renderer.attr(this._tank, {
                        x: n.left
                    });
                    this.renderer.attr(this._tank, {
                        y: n.top
                    });
                    this.renderer.attr(this._tank, {
                        width: n.width
                    });
                    this.renderer.attr(this._tank, {
                        height: n.height
                    })
                } else {
                    this._tank.style.top = n.top;
                    this._tank.style.left = n.left;
                    this._tank.style.width = n.width;
                    this._tank.style.height = n.height
                }
            },
            _renderArrowPointer: function() {
                var e = this._getArrowPathByValue(0);
                this._pointer = this.renderer.path(e, this.pointer.style)
            },
            _renderArrowPointerByValue: function(e) {
                var f = this._getArrowPathByValue(e);
                this._pointer = this.renderer.path(f, this.pointer.style)
            },
            _getArrowPathByValue: function(o) {
                var i = this._getBorderSize(),
                    m = Math.ceil(this._valueToCoordinates(o)) + i,
                    g = i,
                    h = Math.ceil(this._getSize(this.ticksOffset[0], "width")),
                    f = Math.ceil(this._getSize(this.ticksOffset[1], "height")),
                    j = Math.ceil(this._getSize(this.pointer.offset)),
                    n = Math.ceil(this._getMaxTickSize()),
                    r = Math.ceil(this._getSize(this.pointer.size)),
                    k = Math.ceil(Math.sqrt((r * r) / 3)),
                    q, l, p;
                if (this.orientation === "vertical") {
                    g += h + n + j;
                    l = (j >= 0) ? g + r : g - r;
                    q = "M " + g + " " + m + " L " + l + " " + (m - k) + " L " + l + " " + (m + k)
                } else {
                    var e = this._getMaxLabelSize()["height"];
                    g += h + n + j + e;
                    if (this._isVML) {
                        g -= 2
                    }
                    p = m;
                    m = g;
                    g = p;
                    l = m - r;
                    q = "M " + g + " " + m + " L " + (g - k) + " " + l + " L " + (g + k) + " " + l
                }
                return q
            },
            _setValue: function(e) {
                if (this.pointer.pointerType === "default") {
                    this._performColumnPointerLayout(e)
                } else {
                    this._performArrowPointerLayout(e)
                }
                this.value = e
            },
            _performColumnPointerLayout: function(h) {
                var e, i, p, m = this._valueToCoordinates(h),
                    k = this._getBorderSize(),
                    j = this._getSize(this.ticksOffset[0], "width"),
                    g = this._getSize(this.ticksOffset[1], "height"),
                    n = this._getMaxTickSize(),
                    f = this._getSize(this.pointer.size),
                    l = this._getSize(this.pointer.offset),
                    o = {};
                if (this.int64 !== false) {
                    e = this._valueToCoordinates(this._min64)
                } else {
                    e = this._valueToCoordinates(this.min)
                }
                p = Math.abs(e - m);
                if (this.orientation === "vertical") {
                    i = j + n;
                    o = {
                        left: i + l + 1 + k,
                        top: m,
                        height: p,
                        width: f
                    }
                } else {
                    i = g + n;
                    o = {
                        left: e,
                        top: i + l - f - 1 + k,
                        height: f,
                        width: p
                    }
                }
                this._setRectAttrs(o)
            },
            _performArrowPointerLayout: function(f) {
                var e = this._getArrowPathByValue(f);
                if (this._isVML) {
                    if (this._pointer) {
                        d(this._pointer).remove()
                    }
                    this._renderArrowPointerByValue(f)
                } else {
                    this.renderer.attr(this._pointer, {
                        d: e
                    })
                }
            },
            _setRectAttrs: function(e) {
                if (!this._isVML) {
                    this.renderer.attr(this._pointer, {
                        x: e.left
                    });
                    this.renderer.attr(this._pointer, {
                        y: e.top
                    });
                    this.renderer.attr(this._pointer, {
                        width: e.width
                    });
                    this.renderer.attr(this._pointer, {
                        height: e.height
                    })
                } else {
                    this._pointer.style.top = e.top;
                    this._pointer.style.left = e.left;
                    this._pointer.style.width = e.width;
                    this._pointer.style.height = e.height
                }
            },
            _valueToCoordinates: function(t) {
                var n = this._getBorderSize(),
                    k = this._getScaleLength(),
                    l = this._getSize(this.ticksOffset[0], "width"),
                    j = this._getSize(this.ticksOffset[1], "height"),
                    q, f, h;
                if (this.int64 !== false) {
                    q = t.subtract(this._min64);
                    f = this._max64.subtract(this._min64);
                    if (this.int64 === "s") {
                        if (q.isNegative()) {
                            q.negate()
                        }
                        if (f.isNegative()) {
                            f.negate()
                        }
                    } else {
                        q = q.intPart().abs();
                        f = f.abs()
                    }
                    var e = q.toString(),
                        g = f.toString(),
                        m, s;
                    if (g.length > 15) {
                        var u = g.length - 15;
                        g = g.slice(0, 15) + "." + g.slice(15);
                        s = parseFloat(g);
                        if (e.length > u) {
                            var r = e.length - u;
                            e = e.slice(0, r) + "." + e.slice(r)
                        } else {
                            if (e.length === u) {
                                e = "0." + e
                            } else {
                                var p = "0.";
                                for (var o = 0; o < u - e.length; o++) {
                                    p += "0"
                                }
                                e = p + "" + e
                            }
                        }
                        m = parseFloat(e)
                    } else {
                        if (this.int64 === "s") {
                            m = q.toNumber();
                            s = f.toNumber()
                        } else {
                            m = parseFloat(q.toString());
                            s = parseFloat(f.toString())
                        }
                    }
                    h = (m / s) * k
                } else {
                    q = Math.abs(this.min - t);
                    f = Math.abs(this.max - this.min);
                    h = (q / f) * k
                }
                if (this.orientation === "vertical") {
                    return this._height - h - (this._height - j - k) + n
                }
                return h + l
            },
            _getSize: function(e, f) {
                f = f || (this.orientation === "vertical" ? "width" : "height");
                if (e.toString().indexOf("%") >= 0) {
                    e = (parseInt(e, 10) / 100) * this["_" + f]
                }
                e = parseInt(e, 10);
                return e
            },
            propertiesChangedHandler: function(e, f, g) {
                if (g.width && g.height && Object.keys(g).length == 2) {
                    e.refresh()
                }
            },
            propertyChangedHandler: function(f, g, i, h) {
                if (h == i) {
                    return
                }
                if (f.batchUpdate && f.batchUpdate.width && f.batchUpdate.height && Object.keys(f.batchUpdate).length == 2) {
                    return
                }
                if (g === "tankStyle" && f.pointer.pointerType === "arrow") {
                    return
                }
                if (g == "min") {
                    if (f.int64 === "s") {
                        f._min64 = new d.jqx.math().fromString(h.toString(), 10)
                    } else {
                        if (f.int64 === "u") {
                            f._min64 = new BigNumber(h)
                        } else {
                            this.min = parseFloat(h)
                        }
                    }
                    d.jqx.aria(this, "aria-valuemin", h)
                }
                if (g == "max") {
                    if (f.int64 === "s") {
                        f._max64 = new d.jqx.math().fromString(h.toString(), 10)
                    } else {
                        if (f.int64 === "u") {
                            f._max64 = new BigNumber(h)
                        } else {
                            this.max = parseFloat(h)
                        }
                    }
                    d.jqx.aria(this, "aria-valuemax", h)
                }
                if (g === "disabled") {
                    if (h) {
                        this.disable()
                    } else {
                        this.enable()
                    }
                    d.jqx.aria(this, "aria-disabled", h)
                } else {
                    if (g === "value") {
                        if (this._timeout != undefined) {
                            clearTimeout(this._timeout);
                            this._timeout = null
                        }
                        this.value = i;
                        this.setValue(h)
                    } else {
                        if (g === "colorScheme") {
                            this.pointer.style = null
                        } else {
                            if (g === "orientation" && i !== h) {
                                var e = this.ticksOffset[0];
                                this.ticksOffset[0] = this.ticksOffset[1];
                                this.ticksOffset[1] = e
                            }
                        }
                        if (g !== "animationDuration" && g !== "easing") {
                            this.refresh()
                        }
                    }
                }
                if (this.renderer instanceof d.jqx.HTML5Renderer) {
                    this.renderer.refresh()
                }
            },
            _backgroundConstructor: function(g, e) {
                if (this.host) {
                    return new this._backgroundConstructor(g, e)
                }
                var f = {
                    rectangle: true,
                    roundedRectangle: true
                };
                g = g || {};
                this.style = g.style || {
                    stroke: "#cccccc",
                    fill: null
                };
                if (g.visible || typeof g.visible === "undefined") {
                    this.visible = true
                } else {
                    this.visible = false
                }
                if (f[g.backgroundType]) {
                    this.backgroundType = g.backgroundType
                } else {
                    this.backgroundType = "roundedRectangle"
                }
                if (this.backgroundType === "roundedRectangle") {
                    if (typeof g.borderRadius === "number") {
                        this.borderRadius = g.borderRadius
                    } else {
                        this.borderRadius = 15
                    }
                }
                if (typeof g.showGradient === "undefined") {
                    this.showGradient = true
                } else {
                    this.showGradient = g.showGradient
                }
            },
            resize: function(f, e) {
                this.width = f;
                this.height = e;
                this.refresh()
            },
            _tickConstructor: function(f, e) {
                if (this.host) {
                    return new this._tickConstructor(f, e)
                }
                this.size = e._validatePercentage(f.size, "10%");
                if (f.interval) {
                    this.interval = f.interval
                } else {
                    this.interval = 5
                }
                if (e.int64 === "s") {
                    this._interval64 = new d.jqx.math().fromString(this.interval.toString(), 10)
                } else {
                    if (e.int64 === "u") {
                        this._interval64 = new BigNumber(this.interval)
                    } else {
                        this.interval = parseFloat(this.interval)
                    }
                }
                if (f.number) {
                    this.number = f.number
                } else {
                    this.number = 5
                }
                this.style = f.style || {
                    stroke: "#A1A1A1",
                    "stroke-width": "1px"
                };
                if (typeof f.visible === "undefined") {
                    this.visible = true
                } else {
                    this.visible = f.visible
                }
            },
            _labelsConstructor: function(f, e) {
                if (this.host) {
                    return new this._labelsConstructor(f, e)
                }
                this.position = f.position;
                if (this.position !== "far" && this.position !== "near" && this.position !== "both") {
                    this.position = "both"
                }
                this.formatValue = f.formatValue;
                this.formatSettings = f.formatSettings;
                this.visible = f.visible;
                if (this.visible !== false && this.visible !== true) {
                    this.visible = true
                }
                if (f.interval) {
                    this.interval = f.interval
                } else {
                    this.interval = 10
                }
                if (e.int64 === "s") {
                    this._interval64 = new d.jqx.math().fromString(this.interval.toString(), 10)
                } else {
                    if (e.int64 === "u") {
                        this._interval64 = new BigNumber(this.interval)
                    } else {
                        this.interval = parseFloat(this.interval)
                    }
                }
                if (f.number) {
                    this.number = f.number
                } else {
                    this.number = 10
                }
                this.fontSize = f.fontSize;
                this.fontFamily = f.fontFamily;
                this.fontWeight = f.fontWeight;
                this.fontStyle = f.fontStyle;
                this.offset = e._validatePercentage(f.offset, 0)
            },
            _rangeConstructor: function(f, e) {
                if (this.host) {
                    return new this._rangeConstructor(f, e)
                }
                if (f.startValue) {
                    this.startValue = f.startValue
                } else {
                    this.startValue = e.min
                }
                if (f.endValue) {
                    this.endValue = f.endValue
                } else {
                    this.endValue = e.max
                }
                if (e.int64 === "s") {
                    this._startValue64 = new d.jqx.math().fromString(this.startValue.toString(), 10);
                    this._endValue64 = new d.jqx.math().fromString(this.endValue.toString(), 10);
                    if (this._endValue64.lessThanOrEqual(this._startValue64)) {
                        this._endValue64 = this._startValue64.add(new d.jqx.math().fromNumber(1, 10));
                        this.endValue = this._endValue64.toString()
                    }
                } else {
                    if (e.int64 === "u") {
                        this._startValue64 = new BigNumber(this.startValue);
                        this._endValue64 = new BigNumber(this.endValue);
                        if (this._endValue64.compare(this._startValue64) !== 1) {
                            this._endValue64 = this._startValue64.add(1);
                            this.endValue = this._endValue64.toString()
                        }
                    } else {
                        this.startValue = parseFloat(this.startValue);
                        this.endValue = parseFloat(this.endValue);
                        if (this.endValue <= this.startValue) {
                            this.endValue = this.startValue + 1
                        }
                    }
                }
                this.style = f.style || {
                    fill: "#dddddd",
                    stroke: "#dddddd"
                }
            },
            _pointerConstructor: function(g, e) {
                if (this.host) {
                    return new this._pointerConstructor(g, e)
                }
                var f = e._getColorScheme(e.colorScheme)[0];
                this.pointerType = g.pointerType;
                if (this.pointerType !== "default" && this.pointerType !== "arrow") {
                    this.pointerType = "default"
                }
                this.style = g.style || {
                    fill: f,
                    stroke: f,
                    "stroke-width": 1
                };
                this.size = e._validatePercentage(g.size, "7%");
                this.visible = g.visible;
                if (this.visible !== true && this.visible !== false) {
                    this.visible = true
                }
                this.offset = e._validatePercentage(g.offset, 0)
            }
        };
    d.extend(b, c);
    d.extend(a, c);
    d.jqx.jqxWidget("jqxLinearGauge", "", {});
    d.jqx.jqxWidget("jqxGauge", "", {});
    d.extend(d.jqx._jqxGauge.prototype, b);
    d.extend(d.jqx._jqxLinearGauge.prototype, a)
})(jqxBaseFramework);