/**
 * Alber-文本备注 · 面板组件
 *
 * 左侧：内容编辑区   右侧：备注列表
 * 不依赖 ComfyUI，可单独在浏览器里预览（见 preview.html）
 *
 * 所有 CSS 类名统一使用 alber-tn- 前缀，避免与其他插件冲突。
 */
(function () {
	"use strict";

	const MIN_FONT = 9;
	const MAX_FONT = 48;
	const DEFAULT_FONT = 14;

	const FONTS = [
		{ label: "系统默认", value: 'system-ui, -apple-system, "Segoe UI", "Microsoft YaHei", "PingFang SC", sans-serif' },
		{ label: "微软雅黑", value: '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif' },
		{ label: "黑体", value: 'SimHei, "Heiti SC", "Noto Sans SC", sans-serif' },
		{ label: "宋体", value: 'SimSun, "Songti SC", "Noto Serif SC", serif' },
		{ label: "楷体", value: 'KaiTi, "Kaiti SC", "STKaiti", "Noto Serif SC", serif' },
		{ label: "仿宋", value: 'FangSong, "FangSong SC", "STFangsong", serif' },
		{ label: "等宽", value: 'Consolas, "Cascadia Mono", "JetBrains Mono", "SFMono-Regular", monospace' },
		{ label: "衬线", value: 'Georgia, "Times New Roman", "Noto Serif", serif' },
	];

	const CSS = `
.alber-tn-root {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	overflow: hidden;
	background: #1d1d1f;
	border: 1px solid #3a3a3d;
	border-radius: 6px;
	font-family: system-ui, -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif;
	font-size: 12px;
	color: #d4d4d6;
	user-select: none;
}

/* ---------- 左侧：内容 ---------- */
.alber-tn-left {
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	min-width: 0;
	background: #1a1a1c;
}

.alber-tn-bar {
	display: flex;
	align-items: center;
	gap: 8px;
	flex: 0 0 auto;
	height: 28px;
	padding: 0 8px;
	box-sizing: border-box;
	background: #242427;
	border-bottom: 1px solid #333336;
}

.alber-tn-font {
	flex: 1 1 auto;
	min-width: 0;
	height: 20px;
	padding: 0 3px;
	border: 1px solid #3d3d41;
	border-radius: 4px;
	background: #2c2c30;
	color: #d8d8da;
	font-family: inherit;
	font-size: 11px;
	outline: none;
	cursor: pointer;
}
.alber-tn-font:hover { border-color: #4d4d52; }
.alber-tn-font:focus { border-color: #4a8cf0; }

.alber-tn-zoom {
	display: flex;
	align-items: center;
	gap: 1px;
	flex: 0 0 auto;
	height: 20px;
	box-sizing: border-box;
	padding: 0 1px;
	background: #2c2c30;
	border: 1px solid #3d3d41;
	border-radius: 4px;
}

.alber-tn-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 16px;
	min-width: 19px;
	padding: 0 4px;
	border: none;
	border-radius: 3px;
	background: transparent;
	color: #b9b9bd;
	font-family: inherit;
	font-size: 10.5px;
	line-height: 1;
	cursor: pointer;
	transition: background 0.12s, color 0.12s;
}
.alber-tn-btn:hover { background: #3d3d44; color: #fff; }
.alber-tn-btn:active { background: #4a8cf0; color: #fff; }

.alber-tn-size {
	min-width: 17px;
	text-align: center;
	font-size: 10.5px;
	color: #8f8f95;
	font-variant-numeric: tabular-nums;
}

.alber-tn-count {
	flex: 0 0 auto;
	font-size: 10px;
	color: #6d6d73;
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
}

.alber-tn-editor {
	flex: 1 1 auto;
	width: 100%;
	min-height: 0;
	padding: 9px 11px;
	box-sizing: border-box;
	border: none;
	outline: none;
	resize: none;
	background: transparent;
	color: #e8e8ea;
	line-height: 1.68;
	font-family: inherit;
	font-size: 14px;
	white-space: pre-wrap;
	word-break: break-word;
	overflow-y: auto;
	user-select: text;
	caret-color: #4a8cf0;
}
.alber-tn-editor::placeholder { color: #5a5a60; }

.alber-tn-editor::-webkit-scrollbar,
.alber-tn-items::-webkit-scrollbar { width: 8px; }
.alber-tn-editor::-webkit-scrollbar-track,
.alber-tn-items::-webkit-scrollbar-track { background: transparent; }
.alber-tn-editor::-webkit-scrollbar-thumb,
.alber-tn-items::-webkit-scrollbar-thumb {
	background: #3a3a3f;
	border-radius: 4px;
	border: 2px solid transparent;
	background-clip: padding-box;
}
.alber-tn-editor::-webkit-scrollbar-thumb:hover,
.alber-tn-items::-webkit-scrollbar-thumb:hover { background: #4a4a52; background-clip: padding-box; }

/* ---------- 右侧：列表 ---------- */
.alber-tn-right {
	display: flex;
	flex-direction: column;
	flex: 0 0 134px;
	min-width: 0;
	background: #161618;
	border-left: 1px solid #333336;
}

.alber-tn-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex: 0 0 auto;
	height: 28px;
	padding: 0 5px 0 9px;
	box-sizing: border-box;
	border-bottom: 1px solid #2b2b2e;
}

.alber-tn-title {
	font-size: 10.5px;
	letter-spacing: 0.6px;
	color: #85858c;
}

.alber-tn-add { font-size: 13px; height: 18px; }

.alber-tn-items {
	flex: 1 1 auto;
	min-height: 0;
	overflow-y: auto;
	padding: 4px 4px 6px;
}

.alber-tn-item {
	position: relative;
	padding: 5px 20px 5px 8px;
	margin-bottom: 2px;
	border-radius: 4px;
	font-size: 11.5px;
	line-height: 1.45;
	color: #9a9aa1;
	cursor: pointer;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	transition: background 0.12s, color 0.12s;
}
.alber-tn-item:hover { background: #232326; color: #c8c8cf; }
.alber-tn-item.active { background: #262b34; color: #ebebee; }
.alber-tn-item.active::before {
	content: "";
	position: absolute;
	left: 0;
	top: 5px;
	bottom: 5px;
	width: 2px;
	border-radius: 1px;
	background: #4a8cf0;
}
.alber-tn-item.empty .alber-tn-item-label { color: #5c5c62; font-style: italic; }

.alber-tn-item-label {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.alber-tn-del {
	position: absolute;
	right: 2px;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
	padding: 0;
	border: none;
	border-radius: 3px;
	background: transparent;
	color: #6a6a70;
	font-family: inherit;
	font-size: 12px;
	line-height: 1;
	cursor: pointer;
	opacity: 0;
	transition: opacity 0.12s, background 0.12s, color 0.12s;
}
.alber-tn-item:hover .alber-tn-del { opacity: 1; }
.alber-tn-del:hover { background: #5a2a2a; color: #ff8a8a; }
`;

	function injectCSS() {
		if (document.getElementById("alber-tn-style")) return;
		const style = document.createElement("style");
		style.id = "alber-tn-style";
		style.textContent = CSS;
		document.head.appendChild(style);
	}

	function uid() {
		return "n" + Math.random().toString(36).slice(2, 9);
	}

	function clamp(v, min, max) {
		return Math.min(max, Math.max(min, v));
	}

	/** 取第一行非空文本作为列表标题 */
	function summarize(text) {
		const line = (text || "").split("\n").find((l) => l.trim().length > 0);
		return line ? line.trim().slice(0, 24) : "";
	}

	class AlberNotePanel {
		/**
		 * @param {object|null} node       ComfyUI 节点实例（预览时为 null）
		 * @param {object|null} dataWidget 用于持久化的隐藏 widget（预览时为 null）
		 */
		constructor(node, dataWidget) {
			this.node = node || null;
			this.dataWidget = dataWidget || null;
			this.state = { activeId: null, items: [] };

			const el = document.createElement("div");
			el.className = "alber-tn-root";
			el.innerHTML = [
				'<div class="alber-tn-left">',
				'  <div class="alber-tn-bar">',
				'    <select class="alber-tn-font" title="字体"></select>',
				'    <div class="alber-tn-zoom">',
				'      <button class="alber-tn-btn alber-tn-minus" title="缩小字号（Ctrl + 滚轮 / Ctrl + -）">A-</button>',
				'      <span class="alber-tn-size">14</span>',
				'      <button class="alber-tn-btn alber-tn-plus" title="放大字号（Ctrl + 滚轮 / Ctrl + =）">A+</button>',
				"    </div>",
				'    <span class="alber-tn-count">0 字</span>',
				"  </div>",
				'  <textarea class="alber-tn-editor" spellcheck="false" placeholder="在这里写备注……"></textarea>',
				"</div>",
				'<div class="alber-tn-right">',
				'  <div class="alber-tn-head">',
				'    <span class="alber-tn-title">备注</span>',
				'    <button class="alber-tn-btn alber-tn-add" title="新增备注">+</button>',
				"  </div>",
				'  <div class="alber-tn-items"></div>',
				"</div>",
			].join("\n");
			this.el = el;

			this.editor = el.querySelector(".alber-tn-editor");
			this.fontSel = el.querySelector(".alber-tn-font");
			this.sizeLabel = el.querySelector(".alber-tn-size");
			this.countLabel = el.querySelector(".alber-tn-count");
			this.itemsEl = el.querySelector(".alber-tn-items");

			for (const f of FONTS) {
				const opt = document.createElement("option");
				opt.value = f.value;
				opt.textContent = f.label;
				this.fontSel.appendChild(opt);
			}

			this.bind();
			this.load();
		}

		/* ---------------- 数据 ---------------- */

		makeItem() {
			return { id: uid(), text: "", fontSize: DEFAULT_FONT, fontFamily: FONTS[0].value };
		}

		activeItem() {
			return this.state.items.find((i) => i.id === this.state.activeId) || this.state.items[0];
		}

		save() {
			if (!this.dataWidget) return;
			this.dataWidget.value = JSON.stringify(this.state);
		}

		load() {
			let data = null;
			try {
				data = JSON.parse((this.dataWidget && this.dataWidget.value) || "null");
			} catch (e) {
				data = null;
			}
			if (!data || !Array.isArray(data.items)) data = { activeId: null, items: [] };

			data.items = data.items
				.filter((it) => it && typeof it === "object")
				.map((it) => ({
					id: it.id || uid(),
					text: typeof it.text === "string" ? it.text : "",
					fontSize: clamp(Number(it.fontSize) || DEFAULT_FONT, MIN_FONT, MAX_FONT),
					fontFamily: typeof it.fontFamily === "string" && it.fontFamily ? it.fontFamily : FONTS[0].value,
				}));

			if (!data.items.length) data.items.push(this.makeItem());
			if (!data.items.some((i) => i.id === data.activeId)) data.activeId = data.items[0].id;

			this.state = data;
			this.refresh();
			this.save();
		}

		/* ---------------- 渲染 ---------------- */

		refresh() {
			const item = this.activeItem();
			this.editor.value = item.text;
			this.applyFont(item);
			this.renderList();
			this.updateCount();
		}

		applyFont(item) {
			this.editor.style.fontSize = item.fontSize + "px";
			this.editor.style.fontFamily = item.fontFamily;
			this.sizeLabel.textContent = String(item.fontSize);
			// 自定义字体不在预设里时补一个 option，避免下拉显示为空
			if (!FONTS.some((f) => f.value === item.fontFamily)) {
				let opt = this.fontSel.querySelector('option[data-custom="1"]');
				if (!opt) {
					opt = document.createElement("option");
					opt.dataset.custom = "1";
					this.fontSel.appendChild(opt);
				}
				opt.value = item.fontFamily;
				opt.textContent = "自定义";
			}
			this.fontSel.value = item.fontFamily;
		}

		renderList() {
			const frag = document.createDocumentFragment();
			for (const it of this.state.items) {
				const row = document.createElement("div");
				row.className = "alber-tn-item" + (it.id === this.state.activeId ? " active" : "");
				row.dataset.id = it.id;

				const label = document.createElement("span");
				label.className = "alber-tn-item-label";
				const title = summarize(it.text);
				label.textContent = title || "（空备注）";
				if (!title) row.classList.add("empty");
				row.appendChild(label);

				const del = document.createElement("button");
				del.className = "alber-tn-del";
				del.textContent = "×";
				del.title = "删除这条备注";
				del.dataset.del = it.id;
				row.appendChild(del);

				frag.appendChild(row);
			}
			this.itemsEl.replaceChildren(frag);
		}

		updateActiveLabel() {
			const row = this.itemsEl.querySelector('.alber-tn-item[data-id="' + this.state.activeId + '"]');
			if (!row) return;
			const title = summarize(this.editor.value);
			const label = row.querySelector(".alber-tn-item-label");
			if (label) label.textContent = title || "（空备注）";
			row.classList.toggle("empty", !title);
		}

		updateCount() {
			this.countLabel.textContent = this.editor.value.length + " 字";
		}

		/* ---------------- 交互 ---------------- */

		bind() {
			// 输入
			this.editor.addEventListener("input", () => {
				const item = this.activeItem();
				if (!item) return;
				item.text = this.editor.value;
				this.updateCount();
				this.updateActiveLabel();
				this.save();
			});

			// 字体
			this.fontSel.addEventListener("change", () => {
				const item = this.activeItem();
				if (!item) return;
				item.fontFamily = this.fontSel.value;
				this.applyFont(item);
				this.save();
			});

			// 字号
			this.el.querySelector(".alber-tn-minus").addEventListener("click", () => this.setFontSize(-1));
			this.el.querySelector(".alber-tn-plus").addEventListener("click", () => this.setFontSize(1));

			// 新增
			this.el.querySelector(".alber-tn-add").addEventListener("click", () => this.addItem());

			// 列表点击（事件委托）
			this.itemsEl.addEventListener("click", (e) => {
				const delBtn = e.target.closest(".alber-tn-del");
				if (delBtn) {
					e.stopPropagation();
					this.removeItem(delBtn.dataset.del);
					return;
				}
				const row = e.target.closest(".alber-tn-item");
				if (row) this.selectItem(row.dataset.id);
			});

			// Ctrl + 滚轮缩放
			this.editor.addEventListener(
				"wheel",
				(e) => {
					e.stopPropagation();
					if (!e.ctrlKey && !e.metaKey) return;
					e.preventDefault();
					this.setFontSize(e.deltaY < 0 ? 1 : -1);
				},
				{ passive: false }
			);

			// 其余区域滚轮不冒泡到画布
			this.el.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

			// 键盘：不要冒泡到画布（否则 Delete 会删节点）
			this.editor.addEventListener("keydown", (e) => {
				e.stopPropagation();
				if (e.ctrlKey || e.metaKey) {
					if (e.key === "=" || e.key === "+") {
						e.preventDefault();
						this.setFontSize(1);
					} else if (e.key === "-" || e.key === "_") {
						e.preventDefault();
						this.setFontSize(-1);
					} else if (e.key === "0") {
						e.preventDefault();
						this.resetFontSize();
					}
				}
			});
		}

		setFontSize(delta) {
			const item = this.activeItem();
			if (!item) return;
			const next = clamp(item.fontSize + delta, MIN_FONT, MAX_FONT);
			if (next === item.fontSize) return;
			item.fontSize = next;
			this.applyFont(item);
			this.save();
		}

		resetFontSize() {
			const item = this.activeItem();
			if (!item) return;
			item.fontSize = DEFAULT_FONT;
			this.applyFont(item);
			this.save();
		}

		addItem() {
			const item = this.makeItem();
			this.state.items.push(item);
			this.state.activeId = item.id;
			this.refresh();
			this.save();
			this.editor.focus();
		}

		removeItem(id) {
			const idx = this.state.items.findIndex((i) => i.id === id);
			if (idx < 0) return;
			this.state.items.splice(idx, 1);
			if (!this.state.items.length) this.state.items.push(this.makeItem());
			if (!this.state.items.some((i) => i.id === this.state.activeId)) {
				this.state.activeId = this.state.items[Math.min(idx, this.state.items.length - 1)].id;
			}
			this.refresh();
			this.save();
		}

		selectItem(id) {
			if (id === this.state.activeId) return;
			this.state.activeId = id;
			this.refresh();
			this.save();
		}

		destroy() {
			if (this.el && this.el.parentElement) this.el.parentElement.removeChild(this.el);
		}
	}

	injectCSS();

	window.__ALBER_TEXT_NOTE__ = {
		AlberNotePanel,
		FONTS,
		MIN_FONT,
		MAX_FONT,
		DEFAULT_FONT,
	};
})();
