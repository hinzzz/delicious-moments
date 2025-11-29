package com.delicious.moments.shared.exception;

import lombok.Getter;

/**
 * 错误码枚举
 */
@Getter
public enum ErrorCode {
    
    // 通用错误 1xxx
    SUCCESS(200, "成功"),
    SYSTEM_ERROR(1000, "系统错误"),
    PARAM_ERROR(1001, "参数错误"),
    NOT_FOUND(1002, "资源不存在"),
    UNAUTHORIZED(1003, "未授权"),
    FORBIDDEN(1004, "无权限"),
    
    // 用户相关 2xxx
    USER_NOT_FOUND(2001, "用户不存在"),
    USER_ALREADY_EXISTS(2002, "用户已存在"),
    WECHAT_LOGIN_FAILED(2003, "微信登录失败"),
    TOKEN_INVALID(2004, "Token无效"),
    TOKEN_EXPIRED(2005, "Token已过期"),
    
    // 家庭相关 3xxx
    FAMILY_NOT_FOUND(3001, "家庭不存在"),
    INVITE_CODE_INVALID(3002, "邀请码无效"),
    ALREADY_IN_FAMILY(3003, "已在家庭中"),
    NOT_FAMILY_MEMBER(3004, "不是家庭成员"),
    NOT_FAMILY_CREATOR(3005, "不是家庭创建者"),
    
    // 菜谱相关 4xxx
    DISH_NOT_FOUND(4001, "菜谱不存在"),
    CATEGORY_NOT_FOUND(4002, "分类不存在"),
    TAG_NOT_FOUND(4003, "标签不存在"),
    CATEGORY_IN_USE(4004, "分类正在使用中"),
    TAG_IN_USE(4005, "标签正在使用中"),
    
    // 菜单相关 5xxx
    MENU_PLAN_NOT_FOUND(5001, "菜单计划不存在"),
    MENU_ITEM_NOT_FOUND(5002, "菜单项不存在"),
    MENU_ITEM_ALREADY_EXISTS(5003, "菜单项已存在"),
    
    // 购物清单相关 6xxx
    SHOPPING_LIST_NOT_FOUND(6001, "购物清单不存在"),
    SHOPPING_ITEM_NOT_FOUND(6002, "购物项不存在"),
    
    // 文件上传相关 7xxx
    FILE_UPLOAD_FAILED(7001, "文件上传失败"),
    FILE_TYPE_NOT_SUPPORTED(7002, "文件类型不支持"),
    FILE_SIZE_EXCEEDED(7003, "文件大小超限");
    
    private final int code;
    private final String message;
    
    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
