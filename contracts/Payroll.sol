pragma solidity ^0.4.2;

import './Ownable.sol';

contract Payroll is Ownable {
    
    struct Employee {
        address id;
        uint salary;
        uint lastPayday;
    }
    
    mapping(address => Employee) employees;
    
    uint constant payDuration = 10 seconds;
    
    uint totalSalary = 0;
    
    modifier isEmployee(address id) {
        require(msg.sender == id);
        _;
    }
   
    function addFund() payable returns (uint) {
        return this.balance;
    }
    
    function calculateRunway() returns (uint) {
        assert(totalSalary != 0x0);
        return this.balance / totalSalary;
    }
    
    function hasEnoughFund() returns (bool) {
        return calculateRunway() > 0;
    }
    
    function getPaid() {
        Employee employee = employees[msg.sender];
        require(employee.id != 0x0);
        
        assert(now - employee.lastPayday >= payDuration);
        
        employee.lastPayday += payDuration;
        employee.id.transfer(employee.salary);
    }
    
    function _partialPaid(Employee employee) private {
        uint payment = employee.salary * (now - employee.lastPayday) / payDuration;
        employee.id.transfer(payment);
    }
    
    function addEmployee(address employeeId, uint salary) isOwned {
        Employee employee = employees[employeeId];
        require(employee.id == 0x0);
        employees[employeeId] = Employee(employeeId, salary * 1 ether, now);
        totalSalary += salary;
    }
    
    function removeEmployee(address employeeId) isOwned {
        Employee employee = employees[employeeId];
        require(employee.id != 0x0);
        _partialPaid(employee);
        totalSalary -= employee.salary;
        delete employees[employeeId];
    }
    
    function changePaymentAddress(address newId) {
        Employee employee = employees[msg.sender];
        require(employee.id != 0x0);
        
        Employee employeeNew = employees[newId];
        require(employeeNew.id == 0x0);
        
        employees[newId] = Employee(newId, employee.salary, employee.lastPayday);
        delete employees[msg.sender];
    }

    function hasEmployee(address employeeId) returns (bool) {
        Employee employee = employees[employeeId];
        return employee.id == employeeId;
    }
}
