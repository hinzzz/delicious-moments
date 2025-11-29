package com.delicious.moments.domain.user.aggregate;

import com.delicious.moments.domain.user.valueobject.UserId;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户聚合根
 */
@Data
public class User {
    
    private UserId userId;
    private String openId;
    private String unionId;
    private String nickname;
    private String avatarUrl;
    private String phone;
    private Integer version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * 创建新用户
     */
    public static User create(String openId, String nickname, String avatarUrl) {
        User user = new User();
        user.openId = openId;
        user.nickname = nickname;
        user.avatarUrl = avatarUrl;
        user.version = 0;
        user.createdAt = LocalDateTime.now();
        user.updatedAt = LocalDateTime.now();
        return user;
    }
    
    /**
     * 更新用户资料
     */
    public void updateProfile(String nickname, String avatarUrl, String phone) {
        if (nickname != null) {
            this.nickname = nickname;
        }
        if (avatarUrl != null) {
            this.avatarUrl = avatarUrl;
        }
        if (phone != null) {
            this.phone = phone;
        }
        this.updatedAt = LocalDateTime.now();
    }
}
