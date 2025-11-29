package com.delicious.moments.infrastructure.persistence.po;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 用户资料持久化对象
 */
@Data
@TableName("user_profile")
public class UserProfilePO {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    
    private String nickname;
    
    private String avatarUrl;
    
    private String phone;
    
    private Integer gender;
    
    private LocalDate birthday;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
