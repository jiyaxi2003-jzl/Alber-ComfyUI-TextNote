/**
 * Alber-文本备注 · ComfyUI 扩展注册
 *
 * 把后端定义的纯 UI 节点接管为一个可交互的 DOM 面板。
 */
import { app } from "../../scripts/app.js";
import "./alber_note_panel.js";

const { AlberNotePanel } = window.__ALBER_TEXT_NOTE__ || {};

const NODE_NAME = "AlberTextNote";
const DATA_WIDGET = "alber_note_data";
const DEFAULT_PANEL_HEIGHT = 316;

/** 注入节点级样式（DOM widget 容器） */
function injectNodeCSS() {
	if (document.getElementById("alber-tn-node-style")) return;
	const style = document.createElement("style");
	style.id = "alber-tn-node-style";
	style.textContent = `
		.alber-tn-dom-widget { overflow: visible; }
		.alber-tn-dom-widget > .alber-tn-root { width: 100%; height: 100%; }
	`;
	document.head.appendChild(style);
}

function setupNode(node) {
	if (!AlberNotePanel) {
		console.error("[Alber-TextNote] alber_note_panel.js 未正确加载");
		return;
	}
	if (typeof node.addDOMWidget !== "function") {
		console.warn("[Alber-TextNote] 当前 ComfyUI 前端不支持 DOM widget，请升级 ComfyUI");
		return;
	}

	injectNodeCSS();

	// 1) 找到后端定义的数据 widget，隐藏它，但保留序列化能力
	const dataWidget = node.widgets?.find((w) => w.name === DATA_WIDGET);
	if (dataWidget) {
		dataWidget.hidden = true;
		dataWidget.computeSize = () => [0, -4];
		dataWidget.draw = () => {};
	}

	// 2) 创建面板
	const panel = new AlberNotePanel(node, dataWidget);
	panel.el.classList.add("alber-tn-dom-widget");
	node._alberNotePanel = panel;

	// 3) 挂成 DOM widget
	const domWidget = node.addDOMWidget("alber_note_ui", "alber_note_ui", panel.el, {
		serialize: false,
		hideOnZoom: false,
	});
	domWidget.computeSize = (width) => [width, DEFAULT_PANEL_HEIGHT];
	node._alberNoteWidget = domWidget;
	node._alberNoteWidgetH = DEFAULT_PANEL_HEIGHT;

	// 4) 默认尺寸
	node.setSize([Math.max(node.size?.[0] || 0, 470), 352]);
	node.resizable = true;
}

/**
 * 让面板高度跟随节点高度
 * ComfyUI 节点的内容区从标题栏下方开始，这里预留一点底部余量
 */
function syncPanelHeight(node) {
	const w = node._alberNoteWidget;
	if (!w || !node.size) return;
	const h = Math.max(120, Math.round(node.size[1] - 36));
	if (node._alberNoteWidgetH !== h) {
		node._alberNoteWidgetH = h;
		w.computeSize = (width) => [width, h];
	}
}

app.registerExtension({
	name: "Alber.TextNote",

	async beforeRegisterNodeDef(nodeType, nodeData) {
		if (nodeData.name !== NODE_NAME) return;

		const onNodeCreated = nodeType.prototype.onNodeCreated;
		nodeType.prototype.onNodeCreated = function () {
			const r = onNodeCreated?.apply(this, arguments);
			try {
				setupNode(this);
			} catch (e) {
				console.error("[Alber-TextNote] 初始化失败", e);
			}
			return r;
		};

		// 加载工作流后恢复内容
		const onConfigure = nodeType.prototype.onConfigure;
		nodeType.prototype.onConfigure = function () {
			const r = onConfigure?.apply(this, arguments);
			try {
				this._alberNotePanel?.load();
				syncPanelHeight(this);
			} catch (e) {
				console.error("[Alber-TextNote] 恢复数据失败", e);
			}
			return r;
		};

		// 节点高度变化时，让面板跟着一起长高
		const onResize = nodeType.prototype.onResize;
		nodeType.prototype.onResize = function () {
			const r = onResize?.apply(this, arguments);
			syncPanelHeight(this);
			return r;
		};

		const onRemoved = nodeType.prototype.onRemoved;
		nodeType.prototype.onRemoved = function () {
			try {
				this._alberNotePanel?.destroy();
			} catch (e) {
				/* ignore */
			}
			this._alberNotePanel = null;
			this._alberNoteWidget = null;
			return onRemoved?.apply(this, arguments);
		};
	},
});
