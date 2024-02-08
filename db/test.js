    let categoriesStr = `ARRAY [yoi, margore, fua]`
    categoriesStr = categoriesStr.replace(/\[([^'\]]+)\]/g, (match, p1) => {
      const elements = p1.split(',').map((item )=> `'${item.trim()}'`);
      return `[${elements.join(',')}]`;
    });
    console.log(categoriesStr)

