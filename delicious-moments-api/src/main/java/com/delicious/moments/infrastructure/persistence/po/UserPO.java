package com.delicious.moments.infrastructure.persistence.po;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户持久化对象
 */
@Data
@TableName("user_aggregate")
public class UserPO {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String openid;
    
    private String unionId;
    
    @Version
    private Integer version;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private LocalDateTime deletedAt;
}
