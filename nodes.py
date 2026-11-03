"""
Alber-文本备注 · 后端节点定义

节点本身不产生任何计算输出，界面完全由前端 DOM widget 渲染。
备注数据以 JSON 字符串形式保存在隐藏 widget `alber_note_data` 中，
随工作流一起序列化，换机器 / 升级 ComfyUI 都不会丢。
"""

#: 隐藏数据的 widget 名，前端 alber_text_note.js 里需保持一致
DATA_WIDGET_NAME = "alber_note_data"


class AlberTextNote:
    """文本备注：右侧是备注列表，左侧是内容编辑区，支持字体与字号设置。"""

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                DATA_WIDGET_NAME: (
                    "STRING",
                    {
                        "default": "",
                        "multiline": False,
                        "dynamicPrompts": False,
                    },
                ),
            },
        }

    RETURN_TYPES = ()
    FUNCTION = "noop"
    OUTPUT_NODE = True
    CATEGORY = "Alber/备注"
    DESCRIPTION = "Alber-文本备注：左侧编辑内容，右侧切换备注列表，支持自定义字体与字号缩放。"

    def noop(self, **kwargs):
        # 纯 UI 节点，不参与实际计算
        return {}


NODE_CLASS_MAPPINGS = {
    "AlberTextNote": AlberTextNote,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "AlberTextNote": "Alber-文本备注 Text Note",
}
