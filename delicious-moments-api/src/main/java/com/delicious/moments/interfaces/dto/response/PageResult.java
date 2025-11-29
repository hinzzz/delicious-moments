package com.delicious.moments.interfaces.dto.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 分页响应结果
 */
@Data
public class PageResult<T> implements Serializable {
    
    private List<T> records;
    private Long total;
    private Long page;
    private Long size;
    private Long pages;
    
    public PageResult() {
    }
    
    public PageResult(List<T> records, Long total, Long page, Long size) {
        this.records = records;
        this.total = total;
        this.page = page;
        this.size = size;
        this.pages = (total + size - 1) / size;
    }
    
    public static <T> PageResult<T> of(List<T> records, Long total, Long page, Long size) {
        return new PageResult<>(records, total, page, size);
    }
}
