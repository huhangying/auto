function buildContent(content){
    var after = '';
    if (content) {
        var list = content.split('|');
        if (list && list.length > 0) {
            list.forEach((p) => {
                if (p.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                    after +=
                        `<div class="text-center">
                          <img src="${p}" class="rounded" alt="">
                        </div>
                        `;
                }
                else {
                    after += `<p>${p}</p>`;
                }
            })
        }
    }

}