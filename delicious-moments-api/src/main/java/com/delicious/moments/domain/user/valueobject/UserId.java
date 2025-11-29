package com.delicious.moments.domain.user.valueobject;

import lombok.Value;

import java.io.Serializable;

/**
 * 用户ID值对象
 */
@Value
public class UserId implements Serializable {
    
    Long value;
    
    public static UserId of(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("用户ID不能为空或小于等于0");
        }
        return new UserId(id);
    }
    
    @Override
    public String toString() {
        return String.valueOf(value);
    }
}
