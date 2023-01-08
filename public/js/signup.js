let options="";
const yearDropdown = document.getElementById('year-dropdown');
let exp=0;
while(exp<20){
    let dateOption = document.createElement('option');          
    dateOption.text = exp+"-"+(exp+2);      
    dateOption.value = exp+"-"+(exp+2); 
    dateOption.className="dropdown-item";      
    yearDropdown.add(dateOption);
    options+=`<option value="${dateOption.value}"> ${dateOption.value}</option>`;
    exp+=2;
}

const addBtn = document.getElementById('add-company');
addBtn.addEventListener('click',(e)=>{
    const companies=document.getElementById('companies');
    const divEle=document.createElement('div');
    divEle.className="mb-3 ps-4 pe-4 row";
    divEle.innerHTML=`
    <div class="col-md-4">
        <label for="name" class="form-label">Company Name:</label>
        <input required name="comp-name" type="text" class="form-control" id="comp-name" placeholder="Enter your Company">
    </div>
    <div class="col-md-4">
        <label for="occupation" class="form-label">Occupation:</label>
        <input required name="occupation" type="text" class="form-control" id="email" placeholder="Enter your Occupation">
    </div>
    <div class="col-md-3">
        <label for="experience" class="form-label">Years of Experience:</label>
        <select id="year-dropdown" name="experience" class="form-select dropdown-list">
            ${options}
        </select>
    </div>
    <div class="col-md-1">
        <button type="button" class="btn btn-delete mt-4">X</button>
    </div>`;
    companies.appendChild(divEle);
    const deleteBtn=document.querySelectorAll('.btn-delete');

deleteBtn.forEach((ele)=>{
    ele.addEventListener('click',(ele)=>{
        ele.preventDefault();
        const child=ele.target.parentElement;
        console.log(child,child.parentElement);
        child.parentElement.remove();
    });
})
});