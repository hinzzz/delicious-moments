package com.delicious.moments.domain.user.repository;

import com.delicious.moments.domain.user.aggregate.User;
import com.delicious.moments.domain.user.valueobject.UserId;

import java.util.Optional;

/**
 * 用户仓储接口
 */
public interface UserRepository {
    
    /**
     * 根据ID查询用户
     */
    Optional<User> findById(UserId userId);
    
    /**
     * 根据OpenID查询用户
     */
    Optional<User> findByOpenId(String openId);
    
    /**
     * 保存用户
     */
    User save(User user);
    
    /**
     * 删除用户
     */
    void delete(UserId userId);
    
    /**
     * 检查OpenID是否存在
     */
    boolean existsByOpenId(String openId);
}
