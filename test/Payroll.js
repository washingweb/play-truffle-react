const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

let Payroll = artifacts.require('./Payroll.sol');

contract('Payroll', function(accounts) {

    const ownerAddress = accounts[0];       // not used
    const notOwnerAddress = accounts[1];    // used for ownership test

    // use a new address for each test
    // warning: max address number may be 10....
    let addressIndex = 2;
    const nextTargetAddress = () => {
        if (addressIndex >= 10) {
            throw new Error("run out of addresses, please update address allocation for test");
        }
        return accounts[addressIndex++]
    };   


    it("could addEmployee", function() {
        var payrollInstance;
        const targetAddress = nextTargetAddress();

        const promise = Payroll.deployed()
            .then((instance) => {
                payrollInstance = instance;
            })
            .then(() => {
                return payrollInstance.addEmployee(targetAddress, 1);
            })
            .then(() => {
                return payrollInstance.hasEmployee.call(targetAddress);
            });

        return expect(promise).to.eventually.equal(true);
    });


    it("could not addEmployee if already exist", function() {
        var payrollInstance;
        const targetAddress = nextTargetAddress();

        const promise = Payroll.deployed()
            .then((instance) => {
                payrollInstance = instance;
            })
            .then(() => {
                return payrollInstance.addEmployee(targetAddress, 1);
            })
            .then(() => {
                return payrollInstance.addEmployee(targetAddress, 1);
            });

        return expect(promise).to.eventually.be.rejected;
    });


    it("could not addEmployee if not called by owner", function() {
        var payrollInstance;
        const targetAddress = nextTargetAddress();

        const promise = Payroll.deployed()
            .then((instance) => {
                payrollInstance = instance;
            })
            .then(() => {
                return payrollInstance.addEmployee(targetAddress, 1, { from: notOwnerAddress });
            });

        return expect(promise).to.eventually.be.rejected;
    });

    
    it("could removeEmployee for existing employee", function() {
        var payrollInstance;
        const targetAddress = nextTargetAddress();

        const promise = Payroll.deployed()
            .then((instance) => {
                payrollInstance = instance;
            })
            .then(() => {
                return payrollInstance.addEmployee(targetAddress, 1);
            })
            .then(() => {
                return payrollInstance.removeEmployee(targetAddress);
            })
            .then(() => {
                return payrollInstance.hasEmployee.call(targetAddress);
            });

        return expect(promise).to.eventually.equal(false);
    });


    it("could not removeEmployee if id doesn't exist", function() {
        var payrollInstance;
        const targetAddress = nextTargetAddress();
        
        const promise = Payroll.deployed()
            .then((instance) => {
                payrollInstance = instance;
            })
            .then(() => {
                return payrollInstance.removeEmployee(targetAddress);
            });

        return expect(promise).to.eventually.be.rejected;
    });


    it("could not removeEmployee if not called by owner", function() {
        var payrollInstance;
        const targetAddress = nextTargetAddress();

        const promise = Payroll.deployed()
            .then(function(instance) {
                payrollInstance = instance;
            })
            .then(() => {
                return payrollInstance.addEmployee(targetAddress, 1);
            })
            .then(() => {
                return payrollInstance.removeEmployee(targetAddress, { from: accounts[2] });
            })

        return expect(promise).to.eventually.be.rejected;
    });
});
