package com.delicious.moments.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.delicious.moments.infrastructure.persistence.po.UserProfilePO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户资料Mapper
 */
@Mapper
public interface UserProfileMapper extends BaseMapper<UserProfilePO> {
}
