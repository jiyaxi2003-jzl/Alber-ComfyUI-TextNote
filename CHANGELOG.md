# 更新日志

本项目的所有重要变更都会记录在这里，格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2026-11-03

### 新增

- 文本备注节点 `AlberTextNote`，分类 `Alber/备注`
- 左侧内容编辑区 + 右侧备注列表的双栏布局
- 多备注管理：新增、切换、删除，条目标题自动取首行文本
- 字号缩放：`A-` / `A+` 按钮、`Ctrl + 滚轮`、`Ctrl` + `=` / `-` / `0`
- 字体设置：内置 8 种中英文字体，支持备注级别独立配置
- 备注数据随工作流序列化保存（隐藏 widget `alber_note_data`）
- 面板高度随节点高度自适应
- 独立于 ComfyUI 的 `preview.html` 预览页，方便调样式

### 说明

- 纯 UI 节点，`OUTPUT_NODE = True` 且无输出类型，不参与出图流程
- 所有对外命名统一使用 `Alber-` / `alber_` / `alber-tn-` 前缀，避免与其他插件冲突

[1.0.0]: https://github.com/jiyaxi2003-jzl/Alber-ComfyUI-TextNote/releases/tag/v1.0.0
