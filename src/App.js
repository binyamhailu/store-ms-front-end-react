import {useState, useEffect} from 'react'
import {deleteItem, deleteStudent, getAllItems, getAllitems,updateAcceptItem, updateRejectItem} from "./client";
import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Empty,
    Button,
    Badge,
    Tag,
    Avatar,
    Radio, Popconfirm, Image, Divider
} from 'antd';

import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined,
    PlusOutlined
} from '@ant-design/icons';
import StudentDrawerForm from "./ItemDrawerForm";

import './App.css';
import {errorNotification, successNotification} from "./Notification";
import ItemDrawerForm from './ItemDrawerForm';


const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split = trim.split(" ");
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>
        {`${name.charAt(0)}${name.charAt(name.length - 1)}`}
    </Avatar>
}

const removeItem = (itemId, callback) => {
    deleteItem(itemId).then(() => {
        successNotification("Item deleted", `Item with ${itemId} was deleted`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    })
}
const updateStatusAcceptItem = (itemId, callback) => {
    updateAcceptItem(itemId).then(() => {
        successNotification("Item Updated", `Item with ${itemId} was Updated to Accepted`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    })
}
const updateStatusRejectItem = (itemId, callback) => {
    updateRejectItem(itemId).then(() => {
        successNotification("Item Updated", `Item with ${itemId} was Updated to Reject status`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    })
}

const columns = fetchitems => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) =>
            <TheAvatar name={student.name}/>
    },
    // {
    //     title: 'Id',
    //     dataIndex: 'id',
    //     key: 'id',
    // },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    // {
    //     title: 'DESC',
    //     dataIndex: 'desc',
    //     key: 'desc',
    // },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Catagory',
        dataIndex: 'catagory',
        key: 'catagory',
    },
    {
        title: 'STATUS',
        dataIndex: 'itemStatus',
        key: 'itemStatus',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, item) =>
            <Radio.Group>
                {/* <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${item.name}`}
                    onConfirm={() => removeItem(item.id, fetchitems)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm> */}
                <Radio.Button onClick={() => updateStatusAcceptItem(item.id,fetchitems)} value="small" style={{ backgroundColor: '#00e676' }} >Accept</Radio.Button>

                <Radio.Button onClick={() => updateStatusRejectItem(item.id,fetchitems)} value="small" style={{ backgroundColor: '#b71c1c' }}>Reject</Radio.Button>
            </Radio.Group>
    }
];

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

function App() {
    const [items, setItems] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchItems = () =>
        getAllItems()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setItems(data);
            }).catch(err => {
                console.log(err.response)
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification(
                        "There was an issue",
                        `${res.message} [${res.status}] [${res.error}]`
                    )
                });
            }).finally(() => setFetching(false))

    useEffect(() => {
        console.log("component is mounted");
        fetchItems();
    }, []);

    const renderitems = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>
        }
        if (items.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Item
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchItems={fetchItems}
                />
                <Empty/>
            </>
        }
        return <>
            <ItemDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchItems={fetchItems}
            />
            <Table
                dataSource={items}
                columns={columns(fetchItems)}
                bordered
                title={() =>
                    <>
                        <Tag>Number of sold Items</Tag>
                        <Badge  count={items.length}  style={{ backgroundColor: '#52c41a' }}/>
                        <br/><br/>
                        <Button
                            onClick={() => setShowDrawer(!showDrawer)}
                            type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                            Add New Item
                        </Button>
                    </>
                }
                pagination={{pageSize: 4}}
                scroll={{y: 500}}
                rowKey={item => item.id}
            />
        </>
    }

    return <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed}
               onCollapse={setCollapsed}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined/>}>
                    Item Sales
                </Menu.Item>
        
                <SubMenu key="sub1" icon={<UserOutlined/>} title="ADMIN">
                    <Menu.Item key="1">Profile</Menu.Item>
                
                </SubMenu>
            
                <Menu.Item key="9" icon={<FileOutlined/>}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{padding: 0}}/>
            <Content style={{margin: '0 16px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Admin</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {renderitems()}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                <Divider>
                </Divider>
            </Footer>
        </Layout>
    </Layout>
}

export default App;
