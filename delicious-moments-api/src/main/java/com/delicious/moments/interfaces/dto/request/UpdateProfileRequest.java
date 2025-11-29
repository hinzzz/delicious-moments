package com.delicious.moments.interfaces.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 更新用户资料请求
 */
@Data
@Schema(description = "更新用户资料请求")
public class UpdateProfileRequest {
    
    @Schema(description = "昵称")
    @Size(max = 50, message = "昵称长度不能超过50")
    private String nickname;
    
    @Schema(description = "头像URL")
    private String avatarUrl;
    
    @Schema(description = "手机号")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
}
