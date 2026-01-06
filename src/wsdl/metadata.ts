export const WsdlMetadata = `<?xml version="1.0" encoding="utf-8"?>
<wsdl:definitions name="Metadata" targetNamespace="http://www.exactsoftware.com/services/metadata/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" xmlns:wsx="http://schemas.xmlsoap.org/ws/2004/09/mex" xmlns:wsap="http://schemas.xmlsoap.org/ws/2004/08/addressing/policy" xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="http://www.exactsoftware.com/services/metadata/" xmlns:wsa10="http://www.w3.org/2005/08/addressing" xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">
    <wsp:Policy wsu:Id="BasicHttpBinding_entities_policy">
        <wsp:ExactlyOne>
            <wsp:All>
                <wsp:ExactlyOne>
                    <http:NegotiateAuthentication xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http"/>
                    <http:NtlmAuthentication xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http"/>
                </wsp:ExactlyOne>
            </wsp:All>
        </wsp:ExactlyOne>
    </wsp:Policy>
    <wsdl:types>
        <xs:schema elementFormDefault="qualified" targetNamespace="http://www.exactsoftware.com/services/metadata/" xmlns:xs="http://www.w3.org/2001/XMLSchema">
            <xs:import namespace="http://www.exactsoftware.com/schemas/metadata/entities/"/>
            <xs:element name="Retrieve">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="entity" nillable="true" type="xs:string"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="RetrieveResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="RetrieveResult" nillable="true" type="q1:MetadataEntity" xmlns:q1="http://www.exactsoftware.com/schemas/metadata/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="DefinedEntities">
                <xs:complexType>
                    <xs:sequence/>
                </xs:complexType>
            </xs:element>
            <xs:element name="DefinedEntitiesResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="DefinedEntitiesResult" nillable="true" type="q2:ArrayOfDefinedEntity" xmlns:q2="http://www.exactsoftware.com/schemas/metadata/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:schema>
        <xs:schema attributeFormDefault="qualified" elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://schemas.microsoft.com/2003/10/Serialization/">
            <xs:element name="anyType" nillable="true" type="xs:anyType"/>
            <xs:element name="anyURI" nillable="true" type="xs:anyURI"/>
            <xs:element name="base64Binary" nillable="true" type="xs:base64Binary"/>
            <xs:element name="boolean" nillable="true" type="xs:boolean"/>
            <xs:element name="byte" nillable="true" type="xs:byte"/>
            <xs:element name="dateTime" nillable="true" type="xs:dateTime"/>
            <xs:element name="decimal" nillable="true" type="xs:decimal"/>
            <xs:element name="double" nillable="true" type="xs:double"/>
            <xs:element name="float" nillable="true" type="xs:float"/>
            <xs:element name="int" nillable="true" type="xs:int"/>
            <xs:element name="long" nillable="true" type="xs:long"/>
            <xs:element name="QName" nillable="true" type="xs:QName"/>
            <xs:element name="short" nillable="true" type="xs:short"/>
            <xs:element name="string" nillable="true" type="xs:string"/>
            <xs:element name="unsignedByte" nillable="true" type="xs:unsignedByte"/>
            <xs:element name="unsignedInt" nillable="true" type="xs:unsignedInt"/>
            <xs:element name="unsignedLong" nillable="true" type="xs:unsignedLong"/>
            <xs:element name="unsignedShort" nillable="true" type="xs:unsignedShort"/>
            <xs:element name="char" nillable="true" type="tns:char"/>
            <xs:simpleType name="char">
                <xs:restriction base="xs:int"/>
            </xs:simpleType>
            <xs:element name="duration" nillable="true" type="tns:duration"/>
            <xs:simpleType name="duration">
                <xs:restriction base="xs:duration">
                    <xs:pattern value="\\-?P(\\d*D)?(T(\\d*H)?(\\d*M)?(\\d*(\\.\\d*)?S)?)?"/>
                    <xs:minInclusive value="-P10675199DT2H48M5.4775808S"/>
                    <xs:maxInclusive value="P10675199DT2H48M5.4775807S"/>
                </xs:restriction>
            </xs:simpleType>
            <xs:element name="guid" nillable="true" type="tns:guid"/>
            <xs:simpleType name="guid">
                <xs:restriction base="xs:string">
                    <xs:pattern value="[\\da-fA-F]{8}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{12}"/>
                </xs:restriction>
            </xs:simpleType>
            <xs:attribute name="FactoryType" type="xs:QName"/>
            <xs:attribute name="Id" type="xs:ID"/>
            <xs:attribute name="Ref" type="xs:IDREF"/>
        </xs:schema>
        <xs:schema elementFormDefault="qualified" targetNamespace="http://www.exactsoftware.com/schemas/metadata/entities/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://www.exactsoftware.com/schemas/metadata/entities/">
            <xs:complexType name="MetadataEntity">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Interface" nillable="true" type="tns:MetadataInterface"/>
                    <xs:element minOccurs="0" name="Name" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="OperationPermissions" nillable="true" type="tns:MetadataOperationPermission"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="MetadataEntity" nillable="true" type="tns:MetadataEntity"/>
            <xs:complexType name="MetadataInterface">
                <xs:sequence>
                    <xs:element minOccurs="0" name="KeyProperty" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="Properties" nillable="true" type="tns:ArrayOfMetadataProperty"/>
                    <xs:element minOccurs="0" name="SourceKey" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="SourceName" nillable="true" type="xs:string"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="MetadataInterface" nillable="true" type="tns:MetadataInterface"/>
            <xs:complexType name="ArrayOfMetadataProperty">
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="unbounded" name="MetadataProperty" nillable="true" type="tns:MetadataProperty"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="ArrayOfMetadataProperty" nillable="true" type="tns:ArrayOfMetadataProperty"/>
            <xs:complexType name="MetadataProperty">
                <xs:sequence>
                    <xs:element minOccurs="0" name="AllowedCharacters" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="AutoIncrement" type="xs:boolean"/>
                    <xs:element minOccurs="0" name="Caption" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="DefaultValue" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="Description" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="Length" type="xs:int"/>
                    <xs:element minOccurs="0" name="LowerRange" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="Mandatory" type="xs:boolean"/>
                    <xs:element minOccurs="0" name="Name" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="NumericString" type="xs:boolean"/>
                    <xs:element minOccurs="0" name="RightAligned" type="xs:boolean"/>
                    <xs:element minOccurs="0" name="Scale" type="xs:int"/>
                    <xs:element minOccurs="0" name="SecurityContextIncluded" type="xs:boolean"/>
                    <xs:element minOccurs="0" name="SelectionValues" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="SourceName" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="Type" type="tns:MetadataProperty.PropertyType"/>
                    <xs:element minOccurs="0" name="Unsigned" type="xs:boolean"/>
                    <xs:element minOccurs="0" name="UpperCase" type="xs:boolean"/>
                    <xs:element minOccurs="0" name="UpperRange" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="ZeroEqualsNull" type="xs:boolean"/>
                    <xs:element minOccurs="0" name="ZeroFill" type="xs:boolean"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="MetadataProperty" nillable="true" type="tns:MetadataProperty"/>
            <xs:simpleType name="MetadataProperty.PropertyType">
                <xs:restriction base="xs:string">
                    <xs:enumeration value="string"/>
                    <xs:enumeration value="number"/>
                    <xs:enumeration value="date"/>
                    <xs:enumeration value="binary"/>
                    <xs:enumeration value="guid"/>
                    <xs:enumeration value="double"/>
                    <xs:enumeration value="boolean"/>
                    <xs:enumeration value="integer"/>
                    <xs:enumeration value="picture"/>
                    <xs:enumeration value="humanid"/>
                </xs:restriction>
            </xs:simpleType>
            <xs:element name="MetadataProperty.PropertyType" nillable="true" type="tns:MetadataProperty.PropertyType"/>
            <xs:complexType name="MetadataOperationPermission">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Operations" nillable="true" type="tns:ArrayOfMetadataOperation"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="MetadataOperationPermission" nillable="true" type="tns:MetadataOperationPermission"/>
            <xs:complexType name="ArrayOfMetadataOperation">
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="unbounded" name="MetadataOperation" nillable="true" type="tns:MetadataOperation"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="ArrayOfMetadataOperation" nillable="true" type="tns:ArrayOfMetadataOperation"/>
            <xs:complexType name="MetadataOperation">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Context" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="FunctionPoint" type="xs:int"/>
                    <xs:element minOccurs="0" name="Level" type="xs:int"/>
                    <xs:element minOccurs="0" name="Name" nillable="true" type="xs:string"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="MetadataOperation" nillable="true" type="tns:MetadataOperation"/>
            <xs:complexType name="ArrayOfDefinedEntity">
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="unbounded" name="DefinedEntity" nillable="true" type="tns:DefinedEntity"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="ArrayOfDefinedEntity" nillable="true" type="tns:ArrayOfDefinedEntity"/>
            <xs:complexType name="DefinedEntity">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Description" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="Name" nillable="true" type="xs:string"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="DefinedEntity" nillable="true" type="tns:DefinedEntity"/>
        </xs:schema>
    </wsdl:types>
    <wsdl:message name="entities_Retrieve_InputMessage">
        <wsdl:part name="parameters" element="tns:Retrieve"/>
    </wsdl:message>
    <wsdl:message name="entities_Retrieve_OutputMessage">
        <wsdl:part name="parameters" element="tns:RetrieveResponse"/>
    </wsdl:message>
    <wsdl:message name="entities_DefinedEntities_InputMessage">
        <wsdl:part name="parameters" element="tns:DefinedEntities"/>
    </wsdl:message>
    <wsdl:message name="entities_DefinedEntities_OutputMessage">
        <wsdl:part name="parameters" element="tns:DefinedEntitiesResponse"/>
    </wsdl:message>
    <wsdl:portType name="entities">
        <wsdl:operation name="Retrieve">
            <wsdl:input wsaw:Action="http://www.exactsoftware.com/services/metadata/entities/Retrieve" message="tns:entities_Retrieve_InputMessage"/>
            <wsdl:output wsaw:Action="http://www.exactsoftware.com/services/metadata/entities/RetrieveResponse" message="tns:entities_Retrieve_OutputMessage"/>
        </wsdl:operation>
        <wsdl:operation name="DefinedEntities">
            <wsdl:input wsaw:Action="http://www.exactsoftware.com/services/metadata/entities/DefinedEntities" message="tns:entities_DefinedEntities_InputMessage"/>
            <wsdl:output wsaw:Action="http://www.exactsoftware.com/services/metadata/entities/DefinedEntitiesResponse" message="tns:entities_DefinedEntities_OutputMessage"/>
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding_entities" type="tns:entities">
        <wsp:PolicyReference URI="#BasicHttpBinding_entities_policy"/>
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
        <wsdl:operation name="Retrieve">
            <soap:operation soapAction="http://www.exactsoftware.com/services/metadata/entities/Retrieve" style="document"/>
            <wsdl:input>
                <soap:body use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal"/>
            </wsdl:output>
        </wsdl:operation>
        <wsdl:operation name="DefinedEntities">
            <soap:operation soapAction="http://www.exactsoftware.com/services/metadata/entities/DefinedEntities" style="document"/>
            <wsdl:input>
                <soap:body use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal"/>
            </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="Metadata">
        <wsdl:port name="BasicHttpBinding_entities" binding="tns:BasicHttpBinding_entities">
            <soap:address location="http://virtueel2.oudshoornbv.local:8010/services/Exact.Metadata.EG"/>
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>`;
