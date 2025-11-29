package com.delicious.moments.interfaces.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 用户信息DTO
 */
@Data
@Schema(description = "用户信息")
public class UserDTO {
    
    @Schema(description = "用户ID")
    private Long userId;
    
    @Schema(description = "昵称")
    private String nickname;
    
    @Schema(description = "头像URL")
    private String avatarUrl;
    
    @Schema(description = "手机号")
    private String phone;
}
