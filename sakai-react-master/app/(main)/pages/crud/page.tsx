/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

const FootprintCrud = () => {
    const emptyFootprint = {
        measurement_unit: '',
        long: 0,
        high: 0,
        width: 0,
        weight: 0
    };

    const [footprints, setFootprints] = useState(null);
    const [footprintDialog, setFootprintDialog] = useState(false);
    const [deleteFootprintDialog, setDeleteFootprintDialog] = useState(false);
    const [deleteFootprintsDialog, setDeleteFootprintsDialog] = useState(false);
    const [footprint, setFootprint] = useState(emptyFootprint);
    const [selectedFootprints, setSelectedFootprints] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        // Simulación de llamada al servicio
        // Aquí deberías reemplazar con la llamada a tu servicio para obtener footprints
        setFootprints([]);
    }, []);

    const openNew = () => {
        setFootprint(emptyFootprint);
        setSubmitted(false);
        setFootprintDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setFootprintDialog(false);
    };

    const hideDeleteFootprintDialog = () => {
        setDeleteFootprintDialog(false);
    };

    const hideDeleteFootprintsDialog = () => {
        setDeleteFootprintsDialog(false);
    };

    const saveFootprint = () => {
        setSubmitted(true);

        if (footprint.measurement_unit.trim()) {
            let _footprints = [...(footprints as any)];
            let _footprint = { ...footprint };
            if (footprint.id) {
                const index = findIndexById(footprint.id);

                _footprints[index] = _footprint;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Footprint Updated',
                    life: 3000
                });
            } else {
                _footprint.id = createId();
                _footprints.push(_footprint);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Footprint Created',
                    life: 3000
                });
            }

            setFootprints(_footprints as any);
            setFootprintDialog(false);
            setFootprint(emptyFootprint);
        }
    };

    const editFootprint = (footprint: any) => {
        setFootprint({ ...footprint });
        setFootprintDialog(true);
    };

    const confirmDeleteFootprint = (footprint: any) => {
        setFootprint(footprint);
        setDeleteFootprintDialog(true);
    };

    const deleteFootprint = () => {
        let _footprints = (footprints as any)?.filter((val: any) => val.id !== footprint.id);
        setFootprints(_footprints);
        setDeleteFootprintDialog(false);
        setFootprint(emptyFootprint);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Footprint Deleted',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (footprints as any)?.length; i++) {
            if ((footprints as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteFootprintsDialog(true);
    };

    const deleteSelectedFootprints = () => {
        let _footprints = (footprints as any)?.filter((val: any) => !(selectedFootprints as any)?.includes(val));
        setFootprints(_footprints);
        setDeleteFootprintsDialog(false);
        setSelectedFootprints(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Footprints Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _footprint = { ...footprint };
        _footprint[`${name}`] = val;

        setFootprint(_footprint);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _footprint = { ...footprint };
        _footprint[`${name}`] = val;

        setFootprint(_footprint);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedFootprints || !(selectedFootprints as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const measurementUnitBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Measurement Unit</span>
                {rowData.measurement_unit}
            </>
        );
    };

    const longBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Long</span>
                {rowData.long}
            </>
        );
    };

    const highBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">High</span>
                {rowData.high}
            </>
        );
    };

    const widthBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Width</span>
                {rowData.width}
            </>
        );
    };

    const weightBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Weight</span>
                {rowData.weight}
            </>
        );
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editFootprint(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteFootprint(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Footprints</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const footprintDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveFootprint} />
        </>
    );
    const deleteFootprintDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFootprintDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteFootprint} />
        </>
    );
    const deleteFootprintsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFootprintDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedFootprints} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={footprints}
                        selection={selectedFootprints}
                        onSelectionChange={(e) => setSelectedFootprints(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} footprints"
                        globalFilter={globalFilter}
                        emptyMessage="No footprints found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="measurement_unit" header="Unit" sortable body={measurementUnitBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="long" header="Long" sortable body={longBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="high" header="High" sortable body={highBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="width" header="Width" sortable body={widthBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="weight" header="Weight" sortable body={weightBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={footprintDialog} style={{ width: '450px' }} header="Footprint Details" modal className="p-fluid" footer={footprintDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="measurement_unit">Unit</label>
                            <InputText
                                id="measurement_unit"
                                value={footprint.measurement_unit}
                                onChange={(e) => onInputChange(e, 'measurement_unit')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !footprint.measurement_unit
                                })}
                            />
                            {submitted && !footprint.measurement_unit && <small className="p-invalid">Unit is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="long">Long</label>
                            <InputText
                                id="long"
                                value={footprint.long}
                                onChange={(e) => onInputChange(e, 'long')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !footprint.long
                                })}
                            />
                            {submitted && !footprint.long && <small className="p-invalid">Unit is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="high">High</label>
                            <InputText
                                id="high"
                                value={footprint.high}
                                onChange={(e) => onInputChange(e, 'high')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !footprint.high
                                })}
                            />
                            {submitted && !footprint.high && <small className="p-invalid">Unit is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="width">Width</label>
                            <InputText
                                id="width"
                                value={footprint.width}
                                onChange={(e) => onInputChange(e, 'width')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !footprint.width
                                })}
                            />
                            {submitted && !footprint.width && <small className="p-invalid">Unit is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="weight">Weight</label>
                            <InputText
                                id="weight"
                                value={footprint.weight}
                                onChange={(e) => onInputChange(e, 'weight')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !footprint.weight
                                })}
                            />
                            {submitted && !footprint.weight && <small className="p-invalid">Unit is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteFootprintDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteFootprintDialogFooter} onHide={hideDeleteFootprintDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {footprint && (
                                <span>
                                    Are you sure you want to delete <b>{footprint.code}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteFootprintsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteFootprintsDialogFooter} onHide={hideDeleteFootprintsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {footprint && <span>Are you sure you want to delete the selected footprints?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default FootprintCrud;
